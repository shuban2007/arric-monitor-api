import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { temp, hum, aq_raw, aq_level } = req.body;

    if (
      temp === undefined ||
      hum === undefined ||
      aq_raw === undefined ||
      !aq_level
    ) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await supabase
      .from('sensor_data')
      .insert([
        { temp, hum, aq_raw, aq_level }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}