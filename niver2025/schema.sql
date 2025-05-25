-- Create presence_confirmations table
CREATE TABLE presence_confirmations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    names JSONB NOT NULL DEFAULT '[]'::jsonb,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_presence_confirmations_email ON presence_confirmations(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_presence_confirmations_updated_at
    BEFORE UPDATE ON presence_confirmations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 