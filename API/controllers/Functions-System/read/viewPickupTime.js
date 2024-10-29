const puppeteer = require('puppeteer');
const Correios = require('node-cep-correios');


let correios = new Correios();

async function timeLoga(result){
    let response;

    const browser = await puppeteer.launch({
        headless: false, // Mude para true para produção
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    page.on('requestfailed', request => {
        console.log('Request failed:', request.url(), request.failure().errorText);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('Page error:', err.message);
    });

    try {
        console.log('Navigating to the page...');
        await page.goto('https://sgo3.loga.com.br/consultav2/', { waitUntil: 'networkidle2' });

        console.log('Waiting for the search input...');

        await page.waitForSelector('#inputSearch', { visible: true, timeout: 10000 });

        console.log('Typing search term...');
        await page.type('#inputSearch', result);

        console.log('Pressing Enter to initiate search...');
        await page.keyboard.press('Enter');

        console.log('Waiting for the results...');
        // Ajuste o seletor para corresponder corretamente ao elemento
      
        await page.waitForSelector('.result-header--item.toggle-off', { visible: true, timeout: 10000 });

        console.log('Extracting header item...');
        const headerItem = await page.evaluate(() => {
            const headerElement = document.querySelector('.result-header--item.toggle-off tbody');
            return headerElement ? headerElement.innerText.trim() : 'Nenhum item encontrado';
        });

        response = headerItem;

    } catch (error) {
        console.error('Erro ao processar a página:', error.message);
        return null
    } finally {
        await browser.close();
        return response;
    }
};

async function timeUrbis(result2){
    
    let response;

    const browser = await puppeteer.launch({
        headless: false, // Mude para true para produção
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    page.on('requestfailed', request => {
        console.log('Request failed:', request.url(), request.failure().errorText);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('Page error:', err.message);
    });

    try {
        console.log('Navigating to the page...');
        await page.goto('https://www.ecourbis.com.br/coleta/index.html', { waitUntil: 'networkidle2' });
        
        await page.setViewport({width: 1080, height: 1024});
        
        console.log('Waiting for the search input...');
        await page.waitForSelector('.form-control.theme-border-2', { visible: false, timeout: 60000 });

        console.log('Typing search term...');
        await page.type('.form-control.theme-border-2', result2);

        console.log('Pressing Enter to initiate search...');
        await page.keyboard.press('Enter');

        console.log('Waiting for the results...');
        await page.waitForSelector('.cd-loc-table--result', { visible: true, timeout: 60000 });

        console.log('Extracting header item...');
        const headerItem = await page.evaluate(() => {
            const headerElement = document.querySelector('.cd-loc-table--result tbody');
            return headerElement ? headerElement.innerText.trim() : 'Nenhum item encontrado';
        });

        response = headerItem;
        
    } catch (error) {
        console.error('Erro ao processar a página:', error.message);
        return null;
    } finally {
        await browser.close();
        return response;
    }
};

exports.pickupTime = async (req, res) => {
    //verificar qual empresa atende X região chamando as funções
    const {cep} = req.body;
    console.log("olha: "+cep)
    //verifica se o cep é válido
    let erro = 0
    await correios.consultaCEP({ cep: cep })
    .then(result => { 
      if(result.code){
      erro = 1
      }
    })
    .catch(error => {
      console.log(error);
    });
    if(erro == 1){
       return res.status(400).json({msg:"cep inválido"})
    }

    //faz as buscas dos horários no site da ecourbis 
    const ecoUrbis = await timeUrbis(cep);

    //faz as buscas dos horários no site da LOGA
    const ecoLoga  = await timeLoga(cep);

    const parseData = (dataString) => {
        const linhas = dataString.split('\n').slice(1); // Remove a primeira linha (cabeçalho)
        const dados = {};
      
        linhas.forEach(linha => {
          const [dia, diurno, noturno] = linha.split('\t');
          dados[dia] = { diurno, noturno };
        });
        return dados;
      }

    //manda a resposta pro usuario se houver respota no site da LOGA ou Ecourbis
    if (ecoLoga){
        const dados = parseData(ecoLoga)
        return res.status(202).json(dados);
       }
     else if(ecoUrbis){
        const dados = parseData(ecoUrbis) 
        return res.status(202).json(dados);
    }else{
        return res.status(404).json("Verifique se o cep está digitado corretamente." );
    }
};