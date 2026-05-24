import { Html5Qrcode } from 'html5-qrcode';

// Keep global reference of scanner and its camera state
let html5QrScanner = null;
let activeCamerasList = [];
let isScanning = false;

export function initScanner() {
  const tabScanCamera = document.getElementById('tab-scan-camera');
  const tabScanFile = document.getElementById('tab-scan-file');

  const containerScanCamera = document.getElementById('container-scan-camera');
  const containerScanFile = document.getElementById('container-scan-file');

  const selectCameraSource = document.getElementById('select-camera-source');
  const btnCameraStart = document.getElementById('btn-camera-start');
  const btnCameraStop = document.getElementById('btn-camera-stop');
  const viewportNotActive = document.getElementById('viewport-not-active');
  const scanViewfinder = document.getElementById('scan-viewfinder');

  const inputScanImageFile = document.getElementById('input-scan-image-file');

  // Result display states
  const resultStateEmpty = document.getElementById('result-state-empty');
  const resultStatePayload = document.getElementById('result-state-payload');
  const txtScanRaw = document.getElementById('txt-scan-raw');
  const btnResultCopy = document.getElementById('btn-result-copy');
  const btnResultActionUrl = document.getElementById('btn-result-action-url');
  const btnResultReset = document.getElementById('btn-result-reset');

  // Interpreters
  const interpretedWifi = document.getElementById('interpreted-wifi');
  const lblScanWifiSsid = document.getElementById('lbl-scan-wifi-ssid');
  const lblScanWifiEnc = document.getElementById('lbl-scan-wifi-enc');
  const lblScanWifiPass = document.getElementById('lbl-scan-wifi-pass');
  const btnScanWifiCopyPass = document.getElementById('btn-scan-wifi-copy-pass');

  const interpretedVcard = document.getElementById('interpreted-vcard');
  const lblScanCardName = document.getElementById('lbl-scan-card-name');
  const lblScanCardOrg = document.getElementById('lbl-scan-card-org');
  const lblScanCardPhone = document.getElementById('lbl-scan-card-phone');
  const lblScanCardEmail = document.getElementById('lbl-scan-card-email');
  const lblScanCardUrl = document.getElementById('lbl-scan-card-url');

  const interpretedText = document.getElementById('interpreted-text');
  const btnGoogleSearch = document.getElementById('btn-google-search');

  let parsedWifiPassword = null;

  // Toggle between Camera and File scanner sub-tabs
  function switchScannerTab(mode) {
    if (mode === 'camera') {
      tabScanCamera.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 border border-slate-800 font-medium transition duration-200';
      tabScanFile.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 font-medium transition duration-200';
      containerScanCamera.classList.remove('hidden');
      containerScanFile.classList.add('hidden');
    } else {
      tabScanFile.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 border border-slate-800 font-medium transition duration-200';
      tabScanCamera.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 font-medium transition duration-200';
      containerScanFile.classList.remove('hidden');
      containerScanCamera.classList.add('hidden');
      stopActiveCamera(); // Safely stop camera if moving to file uploads
    }
  }

  tabScanCamera.addEventListener('click', () => switchScannerTab('camera'));
  tabScanFile.addEventListener('click', () => switchScannerTab('file'));

  // Attempt to load and list camera stream selectors
  function loadAvailableCameras() {
    Html5Qrcode.getCameras()
      .then(cameras => {
        activeCamerasList = cameras;
        selectCameraSource.innerHTML = '';

        if (cameras.length === 0) {
          const opt = document.createElement('option');
          opt.textContent = 'Kamera tidak ditemukan';
          opt.disabled = true;
          selectCameraSource.appendChild(opt);
          return;
        }

        cameras.forEach((cam, index) => {
          const opt = document.createElement('option');
          opt.value = cam.id;
          opt.className = 'bg-slate-900 text-slate-100 text-xs';
          // Labeling back cameras or defaults nicely
          opt.textContent = cam.label || `Lensa Kamera ${index + 1}`;
          selectCameraSource.appendChild(opt);
        });

        // Autoselect rear facing camera on phones if possible
        const backCam = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('belakang') || c.label.toLowerCase().includes('environment'));
        if (backCam) {
          selectCameraSource.value = backCam.id;
        }
      })
      .catch(err => {
        console.warn('Listing cameras error:', err);
        selectCameraSource.innerHTML = '<option value="" disabled selected class="bg-slate-900">Izin kamera diblokir / bermasalah</option>';
      });
  }

  // Request cameras permission upon mounting or camera-start clicked
  btnCameraStart.addEventListener('click', () => {
    if (isScanning) return;

    const deviceId = selectCameraSource.value;
    if (!deviceId) {
      // Try fetching cameras again in case permission just cleared or granted
      Html5Qrcode.getCameras().then(cameras => {
        if (cameras.length > 0) {
          loadAvailableCameras();
          alert('Daftar kamera dimuat. Pilih lensa dan klik Mulai Kamera kembali.');
        } else {
          alert('Akses kamera diblokir atau lensa sedang digunakan aplikasi lain.');
        }
      }).catch(() => {
        alert('Harap buka setelan peramban Anda untuk mengizinkan kamera.');
      });
      return;
    }

    startCameraScanning(deviceId);
  });

  // Stop camera feed
  btnCameraStop.addEventListener('click', stopActiveCamera);

  function startCameraScanning(cameraId) {
    if (isScanning) return;

    if (!html5QrScanner) {
      // Must target the container ID in index.html exactly
      html5QrScanner = new Html5Qrcode('html5-qr-reader', { verbose: false });
    }

    // Toggle viewport visibility on activation
    viewportNotActive.classList.add('hidden');
    scanViewfinder.classList.remove('hidden');

    btnCameraStart.classList.add('opacity-50', 'pointer-events-none');
    btnCameraStop.classList.remove('opacity-50', 'pointer-events-none');

    const config = {
      fps: 15,
      qrbox: function(width, height) {
        const mini = Math.min(width, height);
        const size = Math.floor(mini * 0.72);
        return { width: size, height: size };
      },
      aspectRatio: 1.777778 // widescreen aspect standard
    };

    html5QrScanner.start(
      cameraId,
      config,
      (decodedText) => {
        // SUCCESS CALLBACK!
        handleDecodingSuccess(decodedText);
        // Play small professional scan haptic if supported
        try {
          if (navigator.vibrate) navigator.vibrate([80]);
        } catch (_) {}
      },
      () => {
        // Silent error reporting during frame scanning iterations to prevent console noise
      }
    )
      .then(() => {
        isScanning = true;
      })
      .catch(err => {
        console.error('Html5Qrcode camera startup failed:', err);
        alert('Gagal menyalakan feed kamera: ' + err);
        stopActiveCamera();
      });
  }

  function stopActiveCamera() {
    if (!isScanning || !html5QrScanner) return;

    html5QrScanner.stop()
      .then(() => {
        isScanning = false;
        viewportNotActive.classList.remove('hidden');
        scanViewfinder.classList.add('hidden');

        btnCameraStart.classList.remove('opacity-50', 'pointer-events-none');
        btnCameraStop.classList.add('opacity-50', 'pointer-events-none');
      })
      .catch(err => {
        console.error('Gagal menghentikan kamera:', err);
      });
  }

  // Handle uploaded local image files parsing
  inputScanImageFile.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;

    // Instantiate a quick ephemeral scanner context for files
    const fileScanner = new Html5Qrcode('html5-qr-reader', { verbose: false });
    
    fileScanner.scanFile(file, true)
      .then(decodedText => {
        handleDecodingSuccess(decodedText);
        // Reset file selector so it triggers "change" event if uploading the same file again
        inputScanImageFile.value = '';
      })
      .catch(err => {
        console.warn('Decode file failure:', err);
        alert('QR Code tidak ditemukan pada berkas gambar ini. Coba gunakan gambar lain yang lebih terang dan berfokus tinggi.');
        inputScanImageFile.value = '';
      });
  });

  // Interpret data payload and display results nicely
  function handleDecodingSuccess(rawText) {
    if (!rawText) return;

    txtScanRaw.textContent = rawText;
    resultStateEmpty.classList.add('hidden');
    resultStatePayload.classList.remove('hidden');

    // Auto link checker
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    const isUrl = urlPattern.test(rawText.trim());

    if (isUrl) {
      btnResultActionUrl.href = rawText.trim();
      btnResultActionUrl.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      btnResultActionUrl.href = '#';
      btnResultActionUrl.classList.add('opacity-50', 'pointer-events-none');
    }

    // Hide all interpreter subsets initially
    interpretedWifi.classList.add('hidden');
    interpretedVcard.classList.add('hidden');
    interpretedText.classList.add('hidden');

    // 1. Check for WiFi Match
    if (rawText.startsWith('WIFI:')) {
      interpretedWifi.classList.remove('hidden');
      
      const ssidMatch = rawText.match(/S:([^;]+)/);
      const encMatch = rawText.match(/T:([^;]+)/);
      const passMatch = rawText.match(/P:([^;]+)/);

      const ssid = ssidMatch ? ssidMatch[1] : 'Tidak dikenal';
      const encryption = encMatch ? encMatch[1] : 'Sandi Terbuka (None)';
      parsedWifiPassword = passMatch ? passMatch[1] : '';

      lblScanWifiSsid.textContent = ssid;
      lblScanWifiEnc.textContent = encryption === 'nopass' ? 'Tidak Terkunci' : encryption;

      if (parsedWifiPassword) {
        lblScanWifiPass.textContent = '••••••••';
        btnScanWifiCopyPass.classList.remove('hidden');
      } else {
        lblScanWifiPass.textContent = 'Tidak memerlukan sandi';
        btnScanWifiCopyPass.classList.add('hidden');
      }

    // 2. Check for vCard Match
    } else if (rawText.includes('BEGIN:VCARD')) {
      interpretedVcard.classList.remove('hidden');

      // Parsers for vCard values using safe regex captures
      const fnMatch = rawText.match(/FN:([^\n\r]+)/);
      const nameMatch = rawText.match(/N:([^\n\r]+)/);
      const orgMatch = rawText.match(/ORG:([^\n\r]+)/);
      const telMatch = rawText.match(/TEL(?:;[^:]*)?:([^\n\r]+)/);
      const mailMatch = rawText.match(/EMAIL(?:;[^:]*)?:([^\n\r]+)/);
      const urlMatch = rawText.match(/URL(?:;[^:]*)?:([^\n\r]+)/);

      // Assemble fallback from Name/FN
      let fullName = 'Kontak Tanpa Nama';
      if (fnMatch) {
         fullName = fnMatch[1].trim();
      } else if (nameMatch) {
         // vCard standard N:LastName;FirstName;Middle;;
         const parts = nameMatch[1].split(';').filter(Boolean);
         fullName = parts.reverse().join(' ').trim();
      }

      lblScanCardName.textContent = fullName;
      lblScanCardOrg.textContent = orgMatch ? orgMatch[1].trim() : 'Perusahaan Umum';
      lblScanCardPhone.textContent = telMatch ? telMatch[1].trim() : 'Tidak ada telepon';
      lblScanCardEmail.textContent = mailMatch ? mailMatch[1].trim() : 'Tidak terdata email';
      
      const webUrl = urlMatch ? urlMatch[1].trim() : '';
      if (webUrl) {
        lblScanCardUrl.textContent = webUrl;
        lblScanCardUrl.parentElement.classList.remove('hidden');
      } else {
        lblScanCardUrl.parentElement.classList.add('hidden');
      }

    // 3. Simple text state fallback
    } else {
      interpretedText.classList.remove('hidden');
      btnGoogleSearch.href = `https://www.google.com/search?q=${encodeURIComponent(rawText)}`;
    }
  }

  // Copy scan payload to clipboard
  btnResultCopy.addEventListener('click', () => {
    const rawText = txtScanRaw.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawText)
        .then(() => {
          alert('Teks berhasil disalin ke papan klip Anda!');
        })
        .catch(err => {
          console.error('Async clipboard failed:', err);
        });
    } else {
      // Fallback
      alert('Gagal mengakses clipboard.');
    }
  });

  // Copy Wifi password helper click
  btnScanWifiCopyPass.addEventListener('click', () => {
    if (parsedWifiPassword && navigator.clipboard) {
      navigator.clipboard.writeText(parsedWifiPassword)
        .then(() => {
          alert('Sandi WiFi telah disalin! Buka Wi-Fi HP dan hubungkan langsung.');
        });
    }
  });

  // Clean scan cards back to empty
  btnResultReset.addEventListener('click', () => {
    resultStateEmpty.classList.remove('hidden');
    resultStatePayload.classList.add('hidden');
    parsedWifiPassword = null;
    txtScanRaw.textContent = '';
  });

  // Mount listeners and probe for cameras right away on load
  loadAvailableCameras();

  // Try parsing camera sources on interval until permission granted (proactive check)
  const permissionPoller = setInterval(() => {
    if (activeCamerasList.length > 0 || isScanning) {
      clearInterval(permissionPoller);
      return;
    }
    Html5Qrcode.getCameras().then(devices => {
      if (devices.length > 0) {
        loadAvailableCameras();
        clearInterval(permissionPoller);
      }
    }).catch(() => {});
  }, 4000);
}
