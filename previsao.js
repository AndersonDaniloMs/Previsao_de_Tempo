const keyWeather = "5f03e26a0f8995b6d82a843283cdd101";


const mostrarNaTela = (dados) => {
  if (dados.name.charAt(dados.name.length - 1) === 'o') {
    document.querySelector(".CidadeTempo").innerHTML = "Tempo no " + dados.name;
  } else {
    document.querySelector(".CidadeTempo").innerHTML = "Tempo em " + dados.name;
  }
  //Pega apenas a parte inteira das temperaturas maximas e minimas
  let Max_Temp = Math.floor(dados.main.temp_max)
  let Min_Temp = Math.floor(dados.main.temp_min)
  console.log("Max:" + Max_Temp + "- Min:" + Min_Temp)

  //Temperatura Media calculada Max+Min/2
  document.querySelector(".temperatura").innerHTML = (Max_Temp + Min_Temp) / 2 + "  ºC";

  // Atualiza o conteúdo do elemento com a classe ".Max" com a temperatura máxima
  document.querySelector(".Max").innerHTML = "Máx:" + Max_Temp + "º";
  // Atualiza o conteúdo do elemento com a classe ".Max" com a temperatura minima
  document.querySelector(".Min").innerHTML = "Mín:" + Min_Temp + "º";

  //Buscar o clima pela API
  document.querySelector(".clima").innerHTML = dados.weather[0].description

  //Mudar o BACKGROUND DO BODY
  const body = document.getElementById("Body")
  if (dados.weather[0].description === "nublado" || dados.weather[0].description === "chuva leve") {
    body.style.background = "linear-gradient(to top, #303336, #1c242e)"
    body.style.transition = "all 0.2s Linear;"
  }
  else {
    body.style.background = "linear-gradient(to top left, #132331, #3566a7)"
    body.style.transition = "all 2s Linear;"
  }

  //Buscar o dados da Umidade da cidade pela API 
  document.querySelector(".Umidade").innerHTML = "humidade: " + dados.main.humidity + "%"
  //Pegar a imagem do clima
  document.querySelector(".imagemTempo").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`

  //Timezone
  let data = new Date();
  let dia = data.getDate(); // Obtém o dia do mês (1-31)
  let semana = data.getDay(); // Obtém o dia da semana (0-6)
  let mes = data.getMonth()
  let Meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dez"];
  let diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  let nomeDiaSemana = diasSemana[semana];
  let NomeMes = Meses[mes].toUpperCase();

  document.querySelector(".DiaSemana").innerHTML = nomeDiaSemana;
  document.querySelector(".diaMes").innerHTML = dia + " " + NomeMes;

}

//Função assincrona para buscar os dados do tempo de acordo a cidade digitada
async function BuscarCidade(cidadeValue) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidadeValue}&appid=${keyWeather}&lang=pt_br&units=metric`);

    if (!response.ok) {
      throw new Error('Erro ao buscar dados da cidade');
    }

    const dadosAPI = await response.json();
    console.log(dadosAPI);
    mostrarNaTela(dadosAPI);
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }

}



let procurarCidade = () => {
  const cidade = document.getElementById("pesquisa").value;
  BuscarCidade(cidade);
}
