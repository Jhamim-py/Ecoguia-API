const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "Ecoguia API",
        description: "Caros, trago aqui a descrição e documentação da API que construímos no nosso TCC de formação do Técnico de Dev. Sistemas." +
        "Nosso projeto foca no MOBILE sendo um app de gerenciamento pessoal sobre consumo sustentável baseado na 12º ODS com uma pitada de gameficação."
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
    components: {
        schemas: {
            someBody: {
                $name: "Jhon Doe",
                $age: 29,
                about: ""
            },
            someResponse: {
                name: "Jhon Doe",
                age: 29,
                diplomas: [
                    {
                        school: "XYZ University",
                        year: 2020,
                        completed: true,
                        internship: {
                            hours: 290,
                            location: "XYZ Company"
                        }
                    }
                ]
            },
            someEnum: {
                '@enum': [
                    "red",
                    "yellow",
                    "green"
                ]
            }
        },
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile     = './swagger-output.json';
const endpointsFiles = ['./API/routes/route.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server');
});