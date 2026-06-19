const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace all wechat-qr with geren
    content = content.split('assets/wechat-qr.png').join('assets/geren.png');
    
    // Revert the ones that were for "微信公众号二维码"
    content = content.split('assets/geren.png" alt="微信公众号二维码"').join('assets/wechat-qr.png" alt="微信公众号二维码"');
    
    // Bump cache version
    content = content.replace(/\?v=\d+/g, '?v=20260623');
    
    fs.writeFileSync(f, content, 'utf8');
});

console.log('Successfully updated HTML files using UTF-8!');