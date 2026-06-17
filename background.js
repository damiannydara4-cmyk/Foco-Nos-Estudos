function atualizarRegrasDeBloqueio() {
    const sitesBloqueados = [
        { id: 1, url: "instagram.com" },
        { id: 2, url: "facebook.com" },
        { id: 3, url: "twitter.com" }
    ];

    const novasRegras = sitesBloqueados.map(site => ({
        id: site.id,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: site.url, resourceTypes: ["main_frame"] }
    }));

    chrome.declarativeNetRequest.getDynamicRules((regrasAtuais) => {
        const idsParaRemover = regrasAtuais.map(r => r.id);
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: idsParaRemover,
            addRules: novasRegras 
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extensão Foco instalada. Aplicando regras...");
    atualizarRegrasDeBloqueio();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Ação para alternar o bloqueio (Ativar/Desativar)
    if (request.acao === "alternarBloqueios") {
        if (request.ativo) {
            atualizarRegrasDeBloqueio();
            sendResponse({ status: "ok" });
        } else {
            chrome.declarativeNetRequest.getDynamicRules((regrasAtuais) => {
                const idsParaRemover = regrasAtuais.map(r => r.id);
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: idsParaRemover
                }, () => {
                    if (chrome.runtime.lastError) {
                        sendResponse({ status: "erro" });
                    } else {
                        sendResponse({ status: "ok" });
                    }
                });
            });
        }
    } 
    
    // Atualizar regras manualmente : comando que você dá para a extensão dizer: "Ei, esqueça tudo o que você estava  fazendo e siga exatamente esta lista que estou te dando agora
    else if (request.acao === "atualizarRegras") { 
    // (instagram, face....)"
        atualizarRegrasDeBloqueio();
        sendResponse({ status: "sucesso" });
    }// Se por algum motivo o bloqueio falhar ou travoar ao clicar em "Atualizar",força a extensão a limpar qualquer erro e aplicar a regra de bloqueio novamente.

    return true; 
});