import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';

// We use fakeBaseQuery since we call Supabase directly
export const baseQuery = fakeBaseQuery();

export { supabase };
