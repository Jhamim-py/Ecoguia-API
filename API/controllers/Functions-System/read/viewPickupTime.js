const puppeteer = require('puppeteer');
const Correios  = require('node-cep-correios');

let correios    = new Correios();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timeLoga(result){
    let response;

    const browser = await puppeteer.launch({
        headless: true, // Mude para true para produção
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (request.resourceType() === 'image') {
            request.abort();
        } else {
            request.continue();
        }
    });

    page.on('requestfailed', request => {
        console.log('A requisição de página falhou:', request.url(), request.failure().errorText);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Erro de console no website:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('Algo deu errado no carregamento da página:', err.message);
    });

    try {
        console.log('Acessando site LOGA...');
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto('https://sgo3.loga.com.br/consultav2/', { waitUntil: 'networkidle0', timeout: 6000 });
        
        await page.waitForSelector('#inputSearch', { visible: true, timeout: 6000 });

        await page.type('#inputSearch', result, {delay: 10});

        await page.keyboard.press('Enter');

        await delay(2000);

        // Verifica se há um erro específico de "não atendido"
        const logaError = await page.evaluate(() => {
            const errorElement = document.querySelector('div');
            return errorElement && errorElement.textContent.includes('Endereço não atendido pela LOGA') ? errorElement.innerText : null;
        });

        if (logaError) {
            console.log('Endereço não atendido pela LOGA.');
            await browser.close();
            return null;
        }

        console.log('Esperando pelos resultados...');
        const selector = await page.waitForSelector('.result-header--item.toggle-off', { visible: true, timeout: 6000 });

        if(selector){
            console.log('Resultados encontrados.');
            const headerItem = await page.evaluate(() => {
                const headerElement = document.querySelector('.result-header--item.toggle-off tbody');
                return headerElement ? headerElement.innerText.trim() : 'Nenhum item encontrado.';
            });
            response = headerItem;
        }
    }catch (error) {
        console.error('Erro ao processar a página LOGA:', error.message);
        return null;
    } finally {
        await browser.close();
        return response;
    }
};

async function timeUrbis(result2){
    let response;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (request.resourceType() === 'image') {
            request.abort();
        } else {
            request.continue();
        }
    });

    page.on('requestfailed', request => {
        console.log('A requisição de página falhou:', request.url(), request.failure().errorText);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Erro de console no website:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('Algo deu errado no carregamento da página:', err.message);
    });

    try {
        console.log('Acessando site Urbis...');
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto('https://www.ecourbis.com.br/coleta/index.html', { waitUntil: 'networkidle0', timeout: 6000 });
        
        await page.setViewport({width: 1030, height: 600});
        
        await page.waitForSelector('.form-control.theme-border-2', { visible: true, timeout: 6000 });

        await page.type('.form-control.theme-border-2', result2, {delay: 10});

        await page.keyboard.press('Enter');

        await delay(2000);

        console.log('Esperando pelos resultados...');
        const selector = await page.waitForSelector('.cd-loc-table--result', { visible: true, timeout: 6000 });

        if (selector) {
            console.log('Resultados encontrados.');

            const headerItem = await page.evaluate(() => {
                const headerElement = document.querySelector('.cd-loc-table--result tbody');
                return headerElement ? headerElement.innerText.trim() : 'Nenhum item encontrado';
            });

            response = headerItem;
        }
    } catch (error) {
        console.error('Erro ao processar a página Ecourbis:', error.message);
        return null;
    } finally {
        await browser.close();
        return response;
    }
};

exports.pickupTime = async (req, res) => {
    //verificar qual empresa atende X região chamando as funções
    const {cep} = req.body;

    let error = 0;

    //verifica se o CEP é válido através da API dos correios
    await correios.consultaCEP({ cep: cep })
        .then(res  => { 
            if(res.code){
                error += 1;
            }
        })
        .catch(err => {
            console.error("Algo deu errado ao verificar CEP: ", err);
            return res.status(500).json({msg:"Algo deu errado ao verificar se o CEP é válido, tente novamente."});
        });

    if(error >= 1){
        return res.status(400).json({msg:"O CEP inserido é considerado inválido, verifique."});
    }

    try{
        // Função para processar dados retornados dos sites
        const parseData = (dataString) => {
            const linhas = dataString.split('\n').slice(1);
            const dados  = {};
          
            linhas.forEach(linha => {
                const [dia, domiciliar, seletiva] = linha.split('\t');
                dados [dia] = { domiciliar, seletiva };
            });
            return dados;
        }

        // Tenta obter os horários no site da LOGA
        const ecoLoga = await timeLoga(cep);
        if (ecoLoga) {
            const dados = parseData(ecoLoga);
            return res.status(202).json(dados);
        }

        // Se LOGA não atende o endereço, tenta no site da EcoUrbis
        const ecoUrbis = await timeUrbis(cep);
        if (ecoUrbis) {
            const dados = parseData(ecoUrbis);
            return res.status(202).json(dados);
        } else {
            return res.status(400).json({ msg: "Nenhum horário de coleta encontrado em LOGA ou EcoUrbis." });
        }

    }catch(error){
        console.error("Algo deu errado ao buscar horários: ", error);
        return res.status(404).json("Verifique se o CEP digitado está correto." );
    }
};