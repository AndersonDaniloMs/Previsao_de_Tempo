const keyWeather = "5f03e26a0f8995b6d82a843283cdd101";

// Função para exibir os dados na tela
const mostrarNaTela = (dados) => {
  const cidadeTempoElemento = document.querySelector(".CidadeTempo");
  const cardsPrevisaoElemento = document.querySelector(".cards-previsao-diaria");

  if (dados.cod === "404") {
    cidadeTempoElemento.innerHTML = "Cidade não encontrada. Por favor, verifique o nome e tente novamente.";
    cardsPrevisaoElemento.innerHTML = ""; // Limpa o conteúdo atual
    return;
  }

  const nomeCidade = dados.city.name;
  const nomeCidadeFormatado = nomeCidade;

  cidadeTempoElemento.innerHTML = nomeCidadeFormatado;
  document.getElementById("country").src = `https://flagsapi.com/${dados.city.country}/flat/64.png`;

  if (!dados.list) return; // Verifica se há dados de previsão disponíveis

  exibirPrevisaoSemana(dados);
}

// Função para exibir a previsão do tempo para os próximos 5 dias
const exibirPrevisaoSemana = (dados) => {
  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const cardsPrevisao = document.querySelector(".cards-previsao-diaria");
  cardsPrevisao.innerHTML = ""; // Limpa o conteúdo atual

  const hoje = new Date();
  let diaAtual = hoje.getDay(); // Dia da semana (0-6)
  const diaMesAtual = hoje.getDate(); // Dia do mês

  // Exibir previsão para os próximos 5 dias
  for (let i = 0; i < 5; i++) {
    const dataPrevisao = new Date(hoje);
    dataPrevisao.setDate(hoje.getDate() + i);
    const diaSemana = diasSemana[dataPrevisao.getDay()];
    const diaMes = `${dataPrevisao.getDate()}/${dataPrevisao.getMonth() < 9 ? "0" : ""}${dataPrevisao.getMonth() + 1}`;

    // Encontrar a previsão para o dia atual na lista de previsões da API
    const previsaoDia = dados.list.find((item) => {
      const dataItem = new Date(item.dt_txt);
      return dataItem.getDate() === dataPrevisao.getDate() && dataItem.getMonth() === dataPrevisao.getMonth();
    });

    if (previsaoDia) {
      const clima = previsaoDia.weather[0].description;
      const tempMedia = Math.floor(previsaoDia.main.temp);
      const tempMax = Math.floor(previsaoDia.main.temp_max);
      const tempMin = Math.floor(previsaoDia.main.temp_min);
      const umidade = previsaoDia.main.humidity;
      const vento = previsaoDia.wind.speed

      const article = criarCardPrevisao(diaSemana, diaMes, clima, tempMedia, tempMax, tempMin, umidade, previsaoDia.weather[0].icon, vento);
      cardsPrevisao.appendChild(article);
    }

    diaAtual = (diaAtual + 1) % 7; // Avança para o próximo dia da semana
  }
}

// Função para criar um card de previsão do tempo
const criarCardPrevisao = (diaSemana, diaMes, clima, tempMedia, tempMax, tempMin, umidade, icone, vento) => {
  const article = document.createElement("article");
  article.innerHTML = `
    <h1 class="DiaSemana">${diaSemana}</h1>
    <p class="diaMes">${diaMes}</p>
    <img width="80px" class="imagemTempo" src="https://openweathermap.org/img/wn/${icone}.png" alt="Tempo" />
    <h1 class="clima">${clima}</h1>
    <h1 class="temperatura">${tempMedia}<sup>ºC</sup></h1>
    <div class="temperaturaMax-Min">
      <h1 class="Max">Máx:${tempMax}<sup>º</sup></h1>
      <h1 class="Min">Mín:${tempMin}<sup>º</sup></h1>
    </div>
    <div class="WindHumidity">
      <h1 class="Umidade"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nOXWzyoFURzA8bGj8AyIV7BQl0JZWFl4IhsLZetGyk55h8tCV2xkIxt5APnXDSs+mrpF+TfzmzO35Ls6dRafZs75TZNlfykM4Aht9PcSXvfeWq/QBl4+wPl6pm50CFc+d4nBOuFV37dSFzqK5x/gfG+kDnjP7+2mRqfwqliNVGgfThTvOBW8qHwLKeDDANxOcbbRJqvAO2GWrSg6jKcK8GP+pYvAy6q3FIG3E8DlXzfOEsCnEfg+AXwXgTsJ4IcIfJEAPo/AmwngjQg8nwCeLQ3noVUBPciiYQzXAfQG42E4D9O4LYkm+xmYwH4BtFX5Sb8Kc2jmY9Kd80533QxfpOy/9AZB8YUChoGp0QAAAABJRU5ErkJggg=="> ${umidade}%</h1> |
      <h1 class="wind"><img width="20px" src="/Content/Img/icons8-wind-48.png" alt="" />${vento}km/h</h1>
    </div>
  `;
  return article;
}

// Função para buscar os dados da cidade
async function buscarDadosCidade(cidadeValue) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidadeValue}&appid=${keyWeather}&lang=pt_br&units=metric`);

    if (!response.ok) {
      throw new Error('Erro ao buscar dados da cidade');
    }

    const dadosAPI = await response.json();
    console.log(dadosAPI);
    mostrarNaTela(dadosAPI);

  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
    document.querySelector(".CidadeTempo").innerHTML = `Cidade ${cidadeValue} não encontrada. Por favor, verifique o nome e tente novamente.`;
    setTimeout(() => {
      document.querySelector(".CidadeTempo").innerHTML = ""
    }, 4000)
    document.querySelector(".cards-previsao-diaria").innerHTML = ""; // Limpa o conteúdo atual
  }
}

const cidade = document.getElementById("pesquisa");
// Função para iniciar a busca ao clicar no botão

const procurarCidade = () => {
  if (cidade.value == "") {
    document.querySelector(".CidadeTempo").innerHTML = `Procure por uma cidade, Por favor!!`;
    setTimeout(() => {
      document.querySelector(".CidadeTempo").innerHTML = ""
    }, 2000)

  } else {
    buscarDadosCidade(cidade.value);
  }

}

//Evento de click na tecla enter
cidade.addEventListener("keyup", (e) => {
  e.preventDefault()
  if (e.code == "Enter") {
    const city = e.target.value
    buscarDadosCidade(city)
  }
})

// Modal
const abrirModal = () => {
  const modal = document.getElementById("modalCompartilhar");
  modal.style.display = "block";
};

const fecharModal = () => {
  const modal = document.getElementById("modalCompartilhar");
  modal.style.display = "none";
};

const copiarLink = () => {
  const linkCompartilhavel = document.getElementById("linkCompartilhavel").value;

  navigator.clipboard.writeText(linkCompartilhavel)
    .then(() => {
      alert("Link copiado para a área de transferência!");
    })
    .catch((error) => {
      console.error("Erro ao copiar o link:", error);
    });
};

const criarLinkCompartilhavel = () => {
  const urlAtual = window.location.href;
  const cidadeAtual = document.querySelector(".CidadeTempo").textContent;

  return `${urlAtual}?cidade=${cidadeAtual}`;
};

const btnCompartilhar = document.getElementById("btnCompartilhar");
btnCompartilhar.addEventListener("click", () => {
  const linkCompartilhavel = criarLinkCompartilhavel();
  const linkCompartilhavelInput = document.getElementById("linkCompartilhavel");
  linkCompartilhavelInput.value = linkCompartilhavel;
  abrirModal();
});

const closeModal = document.getElementById("closeModal");
closeModal.addEventListener("click", fecharModal);

const btnCopiarLink = document.getElementById("btnCopiarLink");
btnCopiarLink.addEventListener("click", copiarLink);

const MudarThemeDeAcordoHorario = () => {
  let body = document.getElementById("Body");
  console.log("Página carregada!");
  let tempo = new Date();
  if (tempo.getHours() < 18) {
    body.style.background = "linear-gradient(to left bottom, #799bc5, #303d4d)";
  } else {
    body.style.background = "linear-gradient(to left top, #2d3844, #303d4d)";
  }
};

// Adicione um ouvinte de evento para acionar a função quando a página for carregada
window.addEventListener('load', MudarThemeDeAcordoHorario);