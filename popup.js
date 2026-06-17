document.addEventListener('DOMContentLoaded', () => {
    const btnToggle = document.getElementById('btnToggle');
    const statusTexto = document.getElementById('statusTexto');
    const btnAtualizar = document.getElementById('btnAtualizar');

    

    //olha se os elementos foram encontrados antes de continuar
    if (!btnToggle || !statusTexto) {
        console.error("Erro: Elementos HTML não encontrados!");
        return;
    }

    function atualizarUI(ativo) {
        statusTexto.innerText = ativo ? "Bloqueios: Ativos" : "Bloqueios: Desativados";
        btnToggle.innerText = ativo ? "Desativar Bloqueios" : "Ativar Bloqueios";
    }

    chrome.storage.local.get(['bloqueiosAtivos'], (result) => {
        const ativo = result.bloqueiosAtivos !== false;
        atualizarUI(ativo);
    });

    btnToggle.addEventListener('click', () => {
        chrome.storage.local.get(['bloqueiosAtivos'], (result) => {
            const novoEstado = result.bloqueiosAtivos === false;
            chrome.storage.local.set({ bloqueiosAtivos: novoEstado }, () => {
                atualizarUI(novoEstado);
                chrome.runtime.sendMessage({ acao: "alternarBloqueios", ativo: novoEstado }, (response) => {
                    if (response && response.status === "ok") {
                        alert(novoEstado ? "Bloqueios ativados!" : "Bloqueios desativados!");
                    }
                });
            });
        });
    });
    
    btnAtualizar.addEventListener('click', () => {
        chrome.runtime.sendMessage({ acao: "atualizarRegras" }, (response) => {
            if (response && response.status === "sucesso") {
                alert("Regras de bloqueio atualizadas com sucesso!");
            }
        });
    });
});