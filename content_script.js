function verificarBloqueio() {
    chrome.storage.local.get(['bloqueiosAtivos'], (result) => {
        // Se estiver desativado (false), não faz nada
        if (result.bloqueiosAtivos === false) return;

        // Se chegar aqui, está ativo. Cria o overlay:
        if (!document.getElementById('foco-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'foco-overlay'; // Identificador para podermos remover depois
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
            overlay.style.color = 'white';
            overlay.style.zIndex = '999999';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.flexDirection = 'column';

            overlay.innerHTML = `
                <h1>Foco nos Estudos!</h1>
                <p>Você realmente precisa entrar aqui agora?</p>
                <button id="btn-sair" style="padding: 10px 20px; cursor: pointer;">Sair do site</button>
            `;

            document.body.appendChild(overlay);

            document.getElementById('btn-sair').addEventListener('click', () => {
                window.history.back();
            });
        }
    });
}

// Roda ao carregar a página
verificarBloqueio();

// ESCUTA MUDANÇAS: Se você clicar em "Desativar" no popup, o content script remove o overlay na hora!
chrome.storage.onChanged.addListener((changes) => {
    if (changes.bloqueiosAtivos && changes.bloqueiosAtivos.newValue === false) {
        const overlay = document.getElementById('foco-overlay');
        if (overlay) overlay.remove(); // Remove o overlay instantaneamente
    } else if (changes.bloqueiosAtivos && changes.bloqueiosAtivos.newValue === true) {
        verificarBloqueio(); // Se reativar, coloca o overlay de volta
    }
});