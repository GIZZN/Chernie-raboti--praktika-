import { exec } from 'child_process';
import fs from 'fs';

const config = {
  zone_id: "your_zone_id",
  account_id: "your_account_id",
  routes: [
    {
      pattern: "*.webp",
      browser_cache_ttl: 31536000,
      edge_cache_ttl: 31536000,
      cache_level: "cache_everything"
    },
    {
      pattern: "*/assets/*",
      browser_cache_ttl: 31536000,
      edge_cache_ttl: 31536000,
      cache_level: "cache_everything"
    }
  ]
};

if (!config.zone_id || config.zone_id === "your_zone_id") {
  console.error('Please configure your Cloudflare zone_id');
  process.exit(1);
}

if (!config.account_id || config.account_id === "your_account_id") {
  console.error('Please configure your Cloudflare account_id');
  process.exit(1);
}

fs.writeFileSync('cloudflare.json', JSON.stringify(config, null, 2));
exec('cloudflared tunnel route dns chernie-raboti your-domain.com', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Warning: ${stderr}`);
  }
  console.log(`Cloudflare DNS setup complete: ${stdout}`);
}); 