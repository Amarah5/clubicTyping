document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  
  const alphabet = katakana + latin + nums + symbols;
  
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  
  const rainDrops = [];
  
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      
      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  };
  
  setInterval(draw, 30);
  
  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  // Typed.js initialization
  const typed = new Typed('#typed', {
    strings: ['MAÎTRISEZ LE CLAVIER COMME UN PRO', 'APPRENEZ LINUX EN TAPANT', 'DEVENEZ UN HACKER ÉTHIQUE'],
    typeSpeed: 40,
    backSpeed: 20,
    loop: true,
    showCursor: false
  });
  
  // Facebook login
  window.fbAsyncInit = function() {
    FB.init({
      appId: 'VOTRE_APP_ID_ICI',
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });
    
    document.getElementById('fbLoginBtn').onclick = function() {
      FB.login(function(response) {
        if (response.authResponse) {
          FB.api('/me', { fields: 'name,email' }, function(userData) {
            alert("Bienvenue, " + userData.name);
            window.open('https://www.facebook.com/VOTRE_PAGE_ID', '_blank');
          });
        } else {
          alert("Connexion annulée.");
        }
      }, { scope: 'public_profile,email,pages_show_list' });
    };
  };
});
