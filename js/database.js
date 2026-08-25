/**
 * GOD OF AUTOMATION - UNIFIED DATABASE ENGINE (SUPABASE + SOVEREIGN INDEXEDDB)
 * Sovereign AI Infrastructure & Enterprise Workflow Studio
 */

(function (window) {
  'use strict';

  const DB_NAME = 'GodOfAutomation_DB';
  const DB_VERSION = 1;
  const SETTINGS_KEY = 'goa_database_settings';

  class GOADatabaseEngine {
    constructor() {
      this.db = null;
      this.isReady = false;
      this.initPromise = this.init();
    }

    /**
     * Initialize Local Sovereign IndexedDB
     */
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Object store for Leads / Inquiries
          if (!db.objectStoreNames.contains('leads')) {
            const leadsStore = db.createObjectStore('leads', { keyPath: 'id', autoIncrement: false });
            leadsStore.createIndex('reference_id', 'reference_id', { unique: true });
            leadsStore.createIndex('created_at', 'created_at', { unique: false });
            leadsStore.createIndex('status', 'status', { unique: false });
            leadsStore.createIndex('email', 'email', { unique: false });
          }

          // Object store for Consultation Bookings
          if (!db.objectStoreNames.contains('bookings')) {
            const bookingsStore = db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: false });
            bookingsStore.createIndex('reference_id', 'reference_id', { unique: true });
            bookingsStore.createIndex('created_at', 'created_at', { unique: false });
            bookingsStore.createIndex('status', 'status', { unique: false });
          }

          // Object store for Newsletter Subscribers
          if (!db.objectStoreNames.contains('subscribers')) {
            const subsStore = db.createObjectStore('subscribers', { keyPath: 'id', autoIncrement: false });
            subsStore.createIndex('email', 'email', { unique: true });
          }
        };

        request.onsuccess = async (event) => {
          this.db = event.target.result;
          this.isReady = true;

          // Seed sample data if database is empty
          await this.seedInitialDataIfEmpty();
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error('[GOA Database] IndexedDB initialization failed:', event.target.error);
          this.isReady = true; // Still allow fallback to memory/localStorage
          resolve(null);
        };
      });
    }

    /**
     * Helper to generate unique reference code e.g. GOA-94820
     */
    generateRefId(prefix = 'GOA') {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      return `${prefix}-${randomNum}`;
    }

    /**
     * Helper to generate UUID
     */
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    /**
     * Retrieve Supabase configuration from localStorage
     */
    getSettings() {
      try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Could not read settings from localStorage', e);
      }
      return {
        supabaseUrl: '',
        supabaseAnonKey: '',
        autoSync: true,
        notificationEmail: 'godofautomationofficial@gmail.com'
      };
    }

    /**
     * Save Supabase configuration
     */
    saveSettings(settings) {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    }

    /**
     * Test Supabase Connection
     */
    async testSupabaseConnection(url, key) {
      if (!url || !key) {
        return { success: false, message: 'URL and Anon Key are required.' };
      }

      try {
        const cleanUrl = url.replace(/\/$/, '');
        const response = await fetch(`${cleanUrl}/rest/v1/leads_and_inquiries?select=count`, {
          method: 'HEAD',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        });

        if (response.ok || response.status === 200 || response.status === 206) {
          return { success: true, message: 'Successfully connected to Supabase PostgreSQL cluster!' };
        } else if (response.status === 404) {
          return { success: true, message: 'Connected to Supabase! (Table not yet created, run database_schema.sql).' };
        } else {
          return { success: false, message: `Connection error: HTTP ${response.status} ${response.statusText}` };
        }
      } catch (err) {
        return { success: false, message: `Network/CORS error: ${err.message}` };
      }
    }

    /**
     * Attempt sync to Supabase Cloud
     */
    async syncToSupabase(tableName, record) {
      const settings = this.getSettings();
      if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
        return { synced: false, reason: 'No Supabase credentials configured (stored locally in Sovereign DB).' };
      }

      try {
        const cleanUrl = settings.supabaseUrl.replace(/\/$/, '');
        const response = await fetch(`${cleanUrl}/rest/v1/${tableName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': settings.supabaseAnonKey,
            'Authorization': `Bearer ${settings.supabaseAnonKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(record)
        });

        if (response.ok) {
          return { synced: true, message: 'Synced to Supabase PostgreSQL cluster in real time.' };
        } else {
          const errText = await response.text();
          console.warn('[GOA Database] Supabase sync warning:', errText);
          return { synced: false, reason: `Supabase response: HTTP ${response.status}` };
        }
      } catch (err) {
        console.warn('[GOA Database] Supabase sync network exception:', err.message);
        return { synced: false, reason: err.message };
      }
    }

    /**
     * Create Lead / Contact Inquiry
     */
    async createLead(leadData) {
      await this.initPromise;

      const record = {
        id: this.generateUUID(),
        reference_id: this.generateRefId('GOA-LEAD'),
        created_at: new Date().toISOString(),
        full_name: leadData.fullName || leadData.full_name || 'Anonymous Inquiry',
        email: leadData.email || '',
        phone: leadData.phone || 'N/A',
        selected_service: leadData.selectedService || leadData.selected_service || 'General AI Architecture Consultation',
        subject: leadData.subject || 'Autonomous Systems Consultation',
        message: leadData.message || '',
        source_page: leadData.sourcePage || leadData.source_page || window.location.pathname.split('/').pop() || 'Homepage',
        status: 'New',
        metadata: {
          userAgent: navigator.userAgent,
          screen: `${window.innerWidth}x${window.innerHeight}`,
          submittedAtLocale: new Date().toLocaleString()
        }
      };

      // 1. Write to IndexedDB
      if (this.db) {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('leads', 'readwrite');
          const store = tx.objectStore('leads');
          store.add(record);
          tx.oncomplete = () => resolve();
          tx.onerror = (e) => reject(e.target.error);
        });
      } else {
        // Fallback localStorage
        const localLeads = JSON.parse(localStorage.getItem('goa_fallback_leads') || '[]');
        localLeads.unshift(record);
        localStorage.setItem('goa_fallback_leads', JSON.stringify(localLeads));
      }

      // 2. Cloud Supabase Sync
      const syncResult = await this.syncToSupabase('leads_and_inquiries', record);

      return {
        success: true,
        referenceId: record.reference_id,
        record,
        syncResult
      };
    }

    /**
     * Create Consultation Booking
     */
    async createBooking(bookingData) {
      await this.initPromise;

      const record = {
        id: this.generateUUID(),
        reference_id: this.generateRefId('GOA-BOOK'),
        created_at: new Date().toISOString(),
        client_name: bookingData.clientName || bookingData.client_name || 'Enterprise Client',
        email: bookingData.email || '',
        phone: bookingData.phone || 'N/A',
        target_deployment: bookingData.targetDeployment || bookingData.target_deployment || 'Autonomous Hospital OS',
        preferred_date: bookingData.preferredDate || bookingData.preferred_date || new Date().toISOString().split('T')[0],
        preferred_time: bookingData.preferredTime || bookingData.preferred_time || '14:00 IST',
        notes: bookingData.notes || '',
        status: 'Scheduled',
        metadata: {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          sourcePage: window.location.pathname.split('/').pop() || 'Homepage'
        }
      };

      if (this.db) {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction('bookings', 'readwrite');
          const store = tx.objectStore('bookings');
          store.add(record);
          tx.oncomplete = () => resolve();
          tx.onerror = (e) => reject(e.target.error);
        });
      } else {
        const localBookings = JSON.parse(localStorage.getItem('goa_fallback_bookings') || '[]');
        localBookings.unshift(record);
        localStorage.setItem('goa_fallback_bookings', JSON.stringify(localBookings));
      }

      const syncResult = await this.syncToSupabase('consultation_bookings', record);

      return {
        success: true,
        referenceId: record.reference_id,
        record,
        syncResult
      };
    }

    /**
     * Get All Leads
     */
    async getLeads() {
      await this.initPromise;

      if (!this.db) {
        return JSON.parse(localStorage.getItem('goa_fallback_leads') || '[]');
      }

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('leads', 'readonly');
        const store = tx.objectStore('leads');
        const request = store.getAll();

        request.onsuccess = () => {
          const items = request.result || [];
          items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          resolve(items);
        };
        request.onerror = (e) => reject(e.target.error);
      });
    }

    /**
     * Get All Bookings
     */
    async getBookings() {
      await this.initPromise;

      if (!this.db) {
        return JSON.parse(localStorage.getItem('goa_fallback_bookings') || '[]');
      }

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('bookings', 'readonly');
        const store = tx.objectStore('bookings');
        const request = store.getAll();

        request.onsuccess = () => {
          const items = request.result || [];
          items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          resolve(items);
        };
        request.onerror = (e) => reject(e.target.error);
      });
    }

    /**
     * Update Lead Status
     */
    async updateLeadStatus(id, newStatus) {
      await this.initPromise;

      if (!this.db) return false;

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('leads', 'readwrite');
        const store = tx.objectStore('leads');
        const getReq = store.get(id);

        getReq.onsuccess = () => {
          const item = getReq.result;
          if (item) {
            item.status = newStatus;
            store.put(item);
          }
          resolve(true);
        };
        getReq.onerror = (e) => reject(e.target.error);
      });
    }

    /**
     * Delete Lead
     */
    async deleteLead(id) {
      await this.initPromise;

      if (!this.db) return false;

      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('leads', 'readwrite');
        const store = tx.objectStore('leads');
        store.delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    }

    /**
     * Export Table Data to CSV
     */
    async exportToCSV(type = 'leads') {
      const data = type === 'leads' ? await this.getLeads() : await this.getBookings();
      if (!data || data.length === 0) {
        alert(`No ${type} records available to export.`);
        return;
      }

      const headers = Object.keys(data[0]).filter(k => k !== 'metadata');
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GodOfAutomation_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /**
     * Export Table Data to JSON
     */
    async exportToJSON(type = 'leads') {
      const data = type === 'leads' ? await this.getLeads() : await this.getBookings();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GodOfAutomation_${type}_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /**
     * Initial Sample Seed Data for Instant Visual Verification
     */
    async seedInitialDataIfEmpty() {
      const existingLeads = await this.getLeads();
      if (existingLeads.length > 0) return;

      const sampleLeads = [
        {
          id: this.generateUUID(),
          reference_id: 'GOA-LEAD-82910',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          full_name: 'Dr. Rajesh Vardhan',
          email: 'rajesh.v@maxmedgroup.com',
          phone: '+91 98112 40019',
          selected_service: '01. Autonomous Hospital OS',
          subject: 'Hospital OS Deployment for 450-Bed Clinical Facility',
          message: 'Interested in replacing our manual front desk with the autonomous WhatsApp triage and report delivery engine.',
          source_page: 'hospital-os.html',
          status: 'New'
        },
        {
          id: this.generateUUID(),
          reference_id: 'GOA-LEAD-73612',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          full_name: 'Vikramaditya Singhania',
          email: 'vikram@fintechscale.io',
          phone: '+91 99300 81234',
          selected_service: '02. Distributed Transaction System',
          subject: 'Sub-50ms Ledger Replication Architecture',
          message: 'Need advice on Apache Kafka multi-region cluster optimization and dead-letter queue routing for financial settlement.',
          source_page: 'distributed-transaction.html',
          status: 'Contacted'
        },
        {
          id: this.generateUUID(),
          reference_id: 'GOA-LEAD-61904',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
          full_name: 'Ananya Deshmukh',
          email: 'ananya.d@stanfordalumni.org',
          phone: '+1 415 890 2311',
          selected_service: '06. The Elite Resume Rebuild',
          subject: 'FAANG Staff Engineer Resume Optimization',
          message: 'Targeting L6 Staff ML Systems role at Meta / Google. Need complete JSON-restructured career profile with 90%+ ATS match.',
          source_page: 'elite-resume-rebuild.html',
          status: 'In Review'
        }
      ];

      for (const lead of sampleLeads) {
        await this.createLead(lead);
      }

      const sampleBookings = [
        {
          client_name: 'Dr. Rajesh Vardhan',
          email: 'rajesh.v@maxmedgroup.com',
          phone: '+91 98112 40019',
          target_deployment: 'Autonomous Hospital OS',
          preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          preferred_time: '15:00 IST',
          notes: 'Architecture demo for clinical directors and IT leads.'
        }
      ];

      for (const b of sampleBookings) {
        await this.createBooking(b);
      }
    }
  }

  // Attach global instance
  window.GOADatabase = new GOADatabaseEngine();

})(window);
