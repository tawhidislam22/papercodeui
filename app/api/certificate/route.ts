import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Certificate of Achievement';
  const name = searchParams.get('name') || 'Student';
  const description = searchParams.get('description') || '';
  const issuedAt = searchParams.get('issuedAt') || new Date().toISOString();
  const issuedBy = searchParams.get('issuedBy') || 'Paper Code';

  const date = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // Generate SVG certificate
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f2744;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#d4a853;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f0d78c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4a853;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="850" fill="url(#bg)" rx="0"/>
  
  <!-- Border -->
  <rect x="30" y="30" width="1140" height="790" fill="none" stroke="url(#gold)" stroke-width="3" rx="12"/>
  <rect x="40" y="40" width="1120" height="770" fill="none" stroke="url(#gold)" stroke-width="1" rx="8" stroke-dasharray="8,4"/>
  
  <!-- Corner ornaments -->
  <circle cx="60" cy="60" r="6" fill="url(#gold)"/>
  <circle cx="1140" cy="60" r="6" fill="url(#gold)"/>
  <circle cx="60" cy="790" r="6" fill="url(#gold)"/>
  <circle cx="1140" cy="790" r="6" fill="url(#gold)"/>
  
  <!-- Logo area -->
  <rect x="555" y="80" width="90" height="90" rx="20" fill="url(#accent)"/>
  <text x="600" y="140" text-anchor="middle" font-family="monospace" font-size="36" font-weight="bold" fill="white">&lt;/&gt;</text>
  
  <!-- Header -->
  <text x="600" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="url(#gold)" letter-spacing="8">PAPER CODE</text>
  
  <!-- Certificate of text -->
  <text x="600" y="270" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#8ca3c0" letter-spacing="12" text-transform="uppercase">CERTIFICATE OF</text>
  
  <!-- Title -->
  <text x="600" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="url(#gold)" font-weight="bold">${escapeXml(title)}</text>
  
  <!-- Divider -->
  <line x1="350" y1="365" x2="850" y2="365" stroke="url(#gold)" stroke-width="1" opacity="0.5"/>
  
  <!-- Presented to -->
  <text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#8ca3c0" letter-spacing="6">PRESENTED TO</text>
  
  <!-- Name -->
  <text x="600" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="white" font-weight="bold">${escapeXml(name)}</text>
  
  <!-- Underline -->
  <line x1="300" y1="500" x2="900" y2="500" stroke="url(#gold)" stroke-width="2"/>
  
  <!-- Description -->
  <text x="600" y="555" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#8ca3c0" opacity="0.9">${escapeXml(description || 'For outstanding achievement and dedication in learning to code')}</text>
  
  <!-- Bottom section -->
  <line x1="150" y1="650" x2="400" y2="650" stroke="url(#gold)" stroke-width="1"/>
  <text x="275" y="680" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#8ca3c0">${escapeXml(date)}</text>
  <text x="275" y="700" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#5a7a9e" letter-spacing="3">DATE</text>
  
  <line x1="800" y1="650" x2="1050" y2="650" stroke="url(#gold)" stroke-width="1"/>
  <text x="925" y="680" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#8ca3c0">${escapeXml(issuedBy)}</text>
  <text x="925" y="700" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#5a7a9e" letter-spacing="3">INSTRUCTOR</text>
  
  <!-- Seal -->
  <circle cx="600" cy="700" r="40" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="600" cy="700" r="35" fill="none" stroke="url(#gold)" stroke-width="1"/>
  <text x="600" y="695" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="url(#gold)" letter-spacing="2">VERIFIED</text>
  <text x="600" y="715" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="#8ca3c0" letter-spacing="1">PAPER CODE</text>
  
  <!-- Footer -->
  <text x="600" y="780" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="#5a7a9e" letter-spacing="2">papercode.dev</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `attachment; filename="certificate-${Date.now()}.svg"`,
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
