import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: instruments, error } = await supabase.from('instruments').select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch instruments', details: error.message }, { status: 500 });
    }

    return NextResponse.json(instruments || []);
  } catch (error) {
    console.error('Failed to fetch instruments:', error);
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
  }
}