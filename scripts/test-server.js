import http from 'http';

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      resolve({ url, statusCode: res.statusCode, contentType: res.headers['content-type'], length: res.headers['content-length'] });
    }).on('error', reject);
  });
}

async function run() {
  const tests = [
    'http://localhost:4173/',
    'http://localhost:4173/vane1toinf/ezgif-frame-001.jpg',
    'http://localhost:4173/vane1toinf/ezgif-frame-100.jpg',
    'http://localhost:4173/vane1toinf/ezgif-frame-238.jpg',
  ];

  let allPassed = true;
  for (const t of tests) {
    try {
      const r = await checkUrl(t);
      console.log(`[PASS] ${r.statusCode} ${t} (${r.contentType}, ${r.length} bytes)`);
      if (r.statusCode !== 200) allPassed = false;
    } catch (e) {
      console.error(`[FAIL] ${t}: ${e.message}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\nAll asset and frame checks passed successfully!');
  } else {
    process.exit(1);
  }
}

run();
