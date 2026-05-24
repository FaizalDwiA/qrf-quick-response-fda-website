import QRCodeStyling from 'qr-code-styling';

// Keep reference to the QRCodeStyling instance and current logo data
let qrCodeInstance = null;
let currentLogoDataUrl = null;

export function initGenerator() {
  // Get all DOM references
  const btnTextTab = document.getElementById('tab-text');
  const btnWifiTab = document.getElementById('tab-wifi');
  const btnVcardTab = document.getElementById('tab-vcard');

  const fieldsText = document.getElementById('fields-text');
  const fieldsWifi = document.getElementById('fields-wifi');
  const fieldsVcard = document.getElementById('fields-vcard');

  // Input elements
  const inputQrText = document.getElementById('input-qr-text');
  const inputWifiSsid = document.getElementById('input-wifi-ssid');
  const inputWifiPass = document.getElementById('input-wifi-pass');
  const selectWifiEnc = document.getElementById('select-wifi-enc');
  const wifiPassContainer = document.getElementById('wifi-pass-container');
  const btnToggleWifiPass = document.getElementById('btn-toggle-wifi-pass');

  // vCard inputs
  const inputCardName = document.getElementById('input-card-name');
  const inputCardPhone = document.getElementById('input-card-phone');
  const inputCardEmail = document.getElementById('input-card-email');
  const inputCardOrg = document.getElementById('input-card-org');
  const inputCardUrl = document.getElementById('input-card-url');

  // Customizations
  const selectDotStyle = document.getElementById('select-dot-style');
  const selectCornerOuter = document.getElementById('select-corner-outer');
  const selectCornerInner = document.getElementById('select-corner-inner');

  const inputLogoFile = document.getElementById('input-logo-file');
  const btnClearLogo = document.getElementById('btn-clear-logo');
  const txtLogoStatus = document.getElementById('txt-logo-status');

  const switchGradient = document.getElementById('switch-gradient');
  const pickerColorPrimary = document.getElementById('picker-color-primary');
  const pickerColorGradient = document.getElementById('picker-color-gradient');
  const pickerColorBg = document.getElementById('picker-color-bg');

  const lblColorPrimary = document.getElementById('lbl-color-primary');
  const lblColorGradient = document.getElementById('lbl-color-gradient');
  const lblColorBg = document.getElementById('lbl-color-bg');

  const containerColorSecondary = document.getElementById('container-color-secondary');
  const containerGradientSettings = document.getElementById('container-gradient-settings');
  const selectGradientType = document.getElementById('select-gradient-type');
  const sliderGradientAngle = document.getElementById('slider-gradient-angle');
  const lblGradientAngle = document.getElementById('lbl-gradient-angle');
  const containerGradientAngle = document.getElementById('container-gradient-angle');

  const selectExportSize = document.getElementById('select-export-size');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadSvg = document.getElementById('btn-download-svg');

  const qrCanvasTarget = document.getElementById('qr-preview-canvas');

  // Current active data type: 'text' | 'wifi' | 'vcard'
  let currentDataType = 'text';

  // Toggle visible containers based on tabs
  function switchTab(type) {
    currentDataType = type;

    // Reset buttons CSS classes
    [btnTextTab, btnWifiTab, btnVcardTab].forEach(btn => {
      btn.className = 'flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 text-slate-400 hover:text-slate-200';
    });

    // Hide all input areas
    fieldsText.classList.add('hidden');
    fieldsWifi.classList.add('hidden');
    fieldsVcard.classList.add('hidden');

    // Activate the pressed button
    let activeBtn = null;
    let activeFields = null;

    if (type === 'text') {
      activeBtn = btnTextTab;
      activeFields = fieldsText;
    } else if (type === 'wifi') {
      activeBtn = btnWifiTab;
      activeFields = fieldsWifi;
    } else if (type === 'vcard') {
      activeBtn = btnVcardTab;
      activeFields = fieldsVcard;
    }

    if (activeBtn) {
      activeBtn.className = 'flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 bg-slate-900 border border-slate-800 text-white shadow-sm';
    }
    if (activeFields) {
      activeFields.classList.remove('hidden');
    }

    triggerLiveUpdate();
  }

  // Bind tabs event listeners
  btnTextTab.addEventListener('click', () => switchTab('text'));
  btnWifiTab.addEventListener('click', () => switchTab('wifi'));
  btnVcardTab.addEventListener('click', () => switchTab('vcard'));

  // Toggle password visibility
  btnToggleWifiPass.addEventListener('click', () => {
    const isPass = inputWifiPass.type === 'password';
    inputWifiPass.type = isPass ? 'text' : 'password';
    const icon = btnToggleWifiPass.querySelector('i');
    if (isPass) {
      icon?.setAttribute('data-lucide', 'eye-off');
    } else {
      icon?.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // Toggle password container based on WiFi Security Selection
  selectWifiEnc.addEventListener('change', () => {
    if (selectWifiEnc.value === 'nopass') {
      wifiPassContainer.classList.add('hidden');
    } else {
      wifiPassContainer.classList.remove('hidden');
    }
    triggerLiveUpdate();
  });

  // Gradient toggling UI layout
  switchGradient.addEventListener('change', () => {
    const isGradient = switchGradient.checked;
    if (isGradient) {
      containerColorSecondary.classList.remove('opacity-50', 'pointer-events-none');
      containerGradientSettings.classList.remove('hidden');
    } else {
      containerColorSecondary.classList.add('opacity-50', 'pointer-events-none');
      containerGradientSettings.classList.add('hidden');
    }
    triggerLiveUpdate();
  });

  // Gradient angle change
  sliderGradientAngle.addEventListener('input', () => {
    lblGradientAngle.textContent = `${sliderGradientAngle.value}°`;
    triggerLiveUpdate();
  });

  // Update Gradient Linear vs Radial UI
  selectGradientType.addEventListener('change', () => {
    if (selectGradientType.value === 'radial') {
      containerGradientAngle.classList.add('hidden');
    } else {
      containerGradientAngle.classList.remove('hidden');
    }
    triggerLiveUpdate();
  });

  // Handle color pickers label updates
  pickerColorPrimary.addEventListener('input', () => {
    lblColorPrimary.textContent = pickerColorPrimary.value.toUpperCase();
    triggerLiveUpdate();
  });
  pickerColorGradient.addEventListener('input', () => {
    lblColorGradient.textContent = pickerColorGradient.value.toUpperCase();
    triggerLiveUpdate();
  });
  pickerColorBg.addEventListener('input', () => {
    lblColorBg.textContent = pickerColorBg.value.toUpperCase();
    triggerLiveUpdate();
  });

  // Handing logo files loaders
  inputLogoFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentLogoDataUrl = e.target.result;
        txtLogoStatus.innerHTML = `<span class="text-emerald-400 font-bold">✓ Terunggah:</span> ${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}`;
        btnClearLogo.classList.remove('hidden');
        triggerLiveUpdate();
      };
      reader.readAsDataURL(file);
    }
  });

  // Clear branding logo
  btnClearLogo.addEventListener('click', () => {
    currentLogoDataUrl = null;
    inputLogoFile.value = '';
    txtLogoStatus.textContent = 'Belum ada logo terunggah.';
    btnClearLogo.classList.add('hidden');
    triggerLiveUpdate();
  });

  // Attach live listeners for text input changes
  const autoTriggers = [
    inputQrText, inputWifiSsid, inputWifiPass, selectWifiEnc,
    inputCardName, inputCardPhone, inputCardEmail, inputCardOrg, inputCardUrl,
    selectDotStyle, selectCornerOuter, selectCornerInner
  ];
  autoTriggers.forEach(element => {
    element.addEventListener('input', triggerLiveUpdate);
    element.addEventListener('change', triggerLiveUpdate);
  });

  // Generate the text block matching standards
  function getPayload() {
    if (currentDataType === 'text') {
      return inputQrText.value.trim() || 'https://example.com';
    } 
    
    if (currentDataType === 'wifi') {
      const ssid = inputWifiSsid.value.trim() || 'WiFi';
      const enc = selectWifiEnc.value;
      const pass = enc !== 'nopass' ? inputWifiPass.value : '';
      
      // WiFi format: WIFI:S:SSID;T:WPA;P:PASSWORD;;
      if (enc === 'nopass') {
        return `WIFI:S:${ssid};T:nopass;;`;
      } else {
        return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
      }
    } 
    
    if (currentDataType === 'vcard') {
      const name = inputCardName.value.trim() || 'Nama Baru';
      const phone = inputCardPhone.value.trim() || '';
      const email = inputCardEmail.value.trim() || '';
      const org = inputCardOrg.value.trim() || '';
      const url = inputCardUrl.value.trim() || '';

      // Format clean vCard
      let card = 'BEGIN:VCARD\n';
      card += 'VERSION:3.0\n';
      card += `FN:${name}\n`;
      card += `N:;${name};;;\n`;
      if (org) card += `ORG:${org}\n`;
      if (phone) card += `TEL;TYPE=CELL:${phone}\n`;
      if (email) card += `EMAIL;TYPE=PREF,INTERNET:${email}\n`;
      if (url) card += `URL:${url}\n`;
      card += 'END:VCARD';
      return card;
    }

    return 'https://example.com';
  }

  // Construct options for qr-code-styling dynamic instantiation
  function buildOptions(size = 300) {
    const primary = pickerColorPrimary.value;
    const secondary = pickerColorGradient.value;
    const bg = pickerColorBg.value;
    const useGrad = switchGradient.checked;

    const data = getPayload();

    const options = {
      width: size,
      height: size,
      type: 'svg',
      data: data,
      margin: 8,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: currentLogoDataUrl ? 'H' : 'Q' // High error correction when branding logo is embedded
      },
      backgroundOptions: {
        color: bg
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 6
      },
      dotsOptions: {
        type: selectDotStyle.value,
        color: primary
      },
      cornersSquareOptions: {
        type: selectCornerOuter.value,
        color: primary
      },
      cornersDotOptions: {
        type: selectCornerInner.value,
        color: primary
      }
    };

    // Apply color gradient if selected
    if (useGrad) {
      options.dotsOptions.gradient = {
        type: selectGradientType.value,
        rotation: selectGradientType.value === 'linear' ? (parseFloat(sliderGradientAngle.value) * Math.PI) / 180 : 0,
        colorStops: [
          { offset: 0, color: primary },
          { offset: 1, color: secondary }
        ]
      };
      
      // Carry gradients optionally to corners for aesthetic consistency
      options.cornersSquareOptions.gradient = {
        type: selectGradientType.value,
        rotation: selectGradientType.value === 'linear' ? (parseFloat(sliderGradientAngle.value) * Math.PI) / 180 : 0,
        colorStops: [
          { offset: 0, color: primary },
          { offset: 1, color: secondary }
        ]
      };
    }

    // Embed branding logo file
    if (currentLogoDataUrl) {
      options.image = currentLogoDataUrl;
    }

    return options;
  }

  // Update render preview pane
  function triggerLiveUpdate() {
    const opts = buildOptions(250); // Set smaller preview size for visual accuracy

    if (!qrCodeInstance) {
      qrCodeInstance = new QRCodeStyling(opts);
      qrCanvasTarget.innerHTML = '';
      qrCodeInstance.append(qrCanvasTarget);
    } else {
      qrCodeInstance.update(opts);
    }
  }

  // Handle Export triggering high-resolution builders
  async function downloadAndExport(type) {
    const size = parseInt(selectExportSize.value) || 1024;
    
    // Instantiate a temporary QRCodeStyling with complete target width/height
    const highResolutionOpts = buildOptions(size);
    const exporter = new QRCodeStyling(highResolutionOpts);
    
    await exporter.download({
      name: `qrforge-export-${Date.now()}`,
      extension: type
    });
  }

  // Bind exports downloads
  btnDownloadPng.addEventListener('click', () => downloadAndExport('png'));
  btnDownloadSvg.addEventListener('click', () => downloadAndExport('svg'));

  // Trigger initial drawer
  triggerLiveUpdate();
}
