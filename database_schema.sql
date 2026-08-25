-- ============================================================================
-- GOD OF AUTOMATION - DATABASE MIGRATION SCHEMA (SUPABASE / POSTGRESQL)
-- Sovereign AI Infrastructure & Enterprise Workflow Studio
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Leads and Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.leads_and_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    selected_service VARCHAR(255) DEFAULT 'General Consultation',
    subject VARCHAR(255),
    message TEXT,
    source_page VARCHAR(255) DEFAULT 'Homepage',
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'In Review', 'Contacted', 'Qualified', 'Archived')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Create Consultation Bookings Table
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    target_deployment VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Create Newsletter & Updates Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(255) DEFAULT 'Website Footer',
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Create Performance Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads_and_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads_and_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads_and_inquiries (email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.consultation_bookings (preferred_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.consultation_bookings (status);

-- 6. Configure Row Level Security (RLS)
ALTER TABLE public.leads_and_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public submissions (Insert)
CREATE POLICY "Allow public insert for leads" 
ON public.leads_and_inquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert for bookings" 
ON public.consultation_bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert for subscribers" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Allow authenticated/admin read for leads
CREATE POLICY "Allow authenticated read for leads" 
ON public.leads_and_inquiries FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated update for leads" 
ON public.leads_and_inquiries FOR UPDATE 
USING (true);
