import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jcgelvlzwfearecpoaxg.supabase.co'
const supabaseAnonKey = 'sb_publishable_dlyG3pjDXQwPt7XRSIsxgA_tN-PItUj'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
