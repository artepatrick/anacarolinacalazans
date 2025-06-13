-- Drop existing index and trigger
DROP INDEX IF EXISTS idx_presence_confirmations_email;
DROP TRIGGER IF EXISTS update_presence_confirmations_updated_at ON presence_confirmations;

-- Modify the main table to remove the name column
ALTER TABLE public.presence_confirmations DROP COLUMN name;

-- Create a new table for names
CREATE TABLE public.presence_confirmation_names (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    presence_confirmation_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT presence_confirmation_names_pkey PRIMARY KEY (id),
    CONSTRAINT fk_presence_confirmation FOREIGN KEY (presence_confirmation_id)
        REFERENCES public.presence_confirmations (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create index on the foreign key
CREATE INDEX IF NOT EXISTS idx_presence_confirmation_names_confirmation_id 
ON public.presence_confirmation_names USING btree (presence_confirmation_id) TABLESPACE pg_default;

-- Recreate the email index
CREATE INDEX IF NOT EXISTS idx_presence_confirmations_email 
ON public.presence_confirmations USING btree (email) TABLESPACE pg_default;

-- Recreate the trigger
CREATE TRIGGER update_presence_confirmations_updated_at
    BEFORE UPDATE ON presence_confirmations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for the names table
CREATE TRIGGER update_presence_confirmation_names_updated_at
    BEFORE UPDATE ON presence_confirmation_names
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create table for music suggestions
CREATE TABLE public.music_suggestions (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    presence_confirmation_id uuid NOT NULL,
    song_title character varying(255) NOT NULL,
    artist character varying(255),
    spotify_url character varying(512),
    created_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT music_suggestions_pkey PRIMARY KEY (id),
    CONSTRAINT fk_music_suggestion_confirmation FOREIGN KEY (presence_confirmation_id)
        REFERENCES public.presence_confirmations (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create index on the foreign key
CREATE INDEX IF NOT EXISTS idx_music_suggestions_confirmation_id 
ON public.music_suggestions USING btree (presence_confirmation_id) TABLESPACE pg_default;

-- Create trigger for updated_at
CREATE TRIGGER update_music_suggestions_updated_at
    BEFORE UPDATE ON music_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 