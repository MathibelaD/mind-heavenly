-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2');
CREATE TYPE session_type AS ENUM ('INDIVIDUAL', 'COUPLE', 'GROUP');
CREATE TYPE session_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');
CREATE TYPE crisis_level AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'CLIENT',
    is_demo BOOLEAN DEFAULT FALSE,
    first_name TEXT,
    last_name TEXT,
    name TEXT,
    phone TEXT,
    date_of_birth DATE,
    timezone TEXT DEFAULT 'UTC',
    bio TEXT,
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    encryption_key TEXT,
    emergency_contact TEXT,
    medical_history TEXT,
    therapy_goals TEXT,
    couple_id UUID,
    couple_partner_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create therapist_profiles table
CREATE TABLE therapist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number TEXT,
    specialty TEXT[] DEFAULT '{}',
    years_experience INTEGER,
    education TEXT,
    certifications TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    available_hours JSONB,
    practice_address TEXT,
    practice_phone TEXT,
    practice_website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_accepting_clients BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create couples table
CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner1_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner2_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_start DATE,
    therapy_goals TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create therapy_sessions table
CREATE TABLE therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type session_type NOT NULL,
    status session_status DEFAULT 'SCHEDULED',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    ai_summary TEXT,
    recording TEXT,
    meeting_room TEXT,
    meeting_link TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_conversations table
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    context TEXT,
    sentiment TEXT,
    crisis_level crisis_level DEFAULT 'NONE',
    model TEXT DEFAULT 'gpt-4o-mini',
    system_prompt TEXT,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMPTZ,
    escalation_reason TEXT,
    summary TEXT,
    key_insights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    type message_type DEFAULT 'TEXT',
    is_encrypted BOOLEAN DEFAULT TRUE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES therapy_sessions(id) ON DELETE SET NULL,
    ai_conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
    metadata JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_categories table
CREATE TABLE content_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES content_categories(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    media_url TEXT,
    duration INTEGER,
    target_audience TEXT[] DEFAULT '{}',
    difficulty_level TEXT,
    author TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_progress table
CREATE TABLE content_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Create favorite_content table
CREATE TABLE favorite_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'PENDING',
    stripe_payment_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES therapy_sessions(id) ON DELETE SET NULL,
    is_split_payment BOOLEAN DEFAULT FALSE,
    split_percentage DECIMAL(5,2),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create system_logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES therapy_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for couples
ALTER TABLE users 
ADD CONSTRAINT users_couple_id_fkey 
FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE SET NULL;

ALTER TABLE users 
ADD CONSTRAINT users_couple_partner_id_fkey 
FOREIGN KEY (couple_partner_id) REFERENCES couples(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_demo ON users(is_demo);
CREATE INDEX idx_therapy_sessions_client_id ON therapy_sessions(client_id);
CREATE INDEX idx_therapy_sessions_therapist_id ON therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_start_time ON therapy_sessions(start_time);
CREATE INDEX idx_therapy_sessions_status ON therapy_sessions(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_ai_conversation_id ON messages(ai_conversation_id);
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_crisis_level ON ai_conversations(crisis_level);
CREATE INDEX idx_content_category_id ON content(category_id);
CREATE INDEX idx_content_is_published ON content(is_published);
CREATE INDEX idx_content_progress_user_id ON content_progress(user_id);
CREATE INDEX idx_favorite_content_user_id ON favorite_content(user_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapist_profiles_updated_at BEFORE UPDATE ON therapist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_categories_updated_at BEFORE UPDATE ON content_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_progress_updated_at BEFORE UPDATE ON content_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Therapists can view their clients' basic info
CREATE POLICY "Therapists can view clients" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM therapy_sessions 
            WHERE therapist_id = auth.uid() 
            AND (client_id = users.id OR partner_id = users.id)
        )
    );

-- Therapist profiles policies
CREATE POLICY "Therapist profiles are viewable by authenticated users" ON therapist_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Therapists can manage own profile" ON therapist_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Therapy sessions policies
CREATE POLICY "Users can view own sessions" ON therapy_sessions
    FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() = therapist_id OR 
        auth.uid() = partner_id
    );

CREATE POLICY "Therapists can manage sessions" ON therapy_sessions
    FOR ALL USING (auth.uid() = therapist_id);

-- AI conversations policies
CREATE POLICY "Users can manage own AI conversations" ON ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id OR
        EXISTS (
            SELECT 1 FROM therapy_sessions 
            WHERE id = messages.session_id 
            AND (client_id = auth.uid() OR therapist_id = auth.uid() OR partner_id = auth.uid())
        ) OR
        EXISTS (
            SELECT 1 FROM ai_conversations 
            WHERE id = messages.ai_conversation_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Content policies
CREATE POLICY "Published content is viewable by authenticated users" ON content
    FOR SELECT USING (is_published = true AND auth.role() = 'authenticated');

CREATE POLICY "Content categories are viewable by authenticated users" ON content_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Content progress policies
CREATE POLICY "Users can manage own content progress" ON content_progress
    FOR ALL USING (auth.uid() = user_id);

-- Favorite content policies
CREATE POLICY "Users can manage own favorites" ON favorite_content
    FOR ALL USING (auth.uid() = user_id);

-- Payment policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = payer_id);

-- System logs policies (admin only)
CREATE POLICY "System logs are admin only" ON system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'ADMIN'
        )
    );
