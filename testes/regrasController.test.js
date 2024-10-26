const { verificarCep, determinarDiaDeEntrega } = require('../controllers/regrasController');

describe('Regras de Entrega', () => {
    test('verificarCep deve retornar true para CEP válido', () => {
        const cepValido = '01000-000';
        expect(verificarCep(cepValido)).toBe(true);
    });

    test('verificarCep deve retornar false para CEP inválido', () => {
        const cepInvalido = '99999-999';
        expect(verificarCep(cepInvalido)).toBe(false);
    });

    test('determinarDiaDeEntrega deve retornar o dia correto baseado no bairro', () => {
        const bairro = 'Centro';
        expect(determinarDiaDeEntrega(bairro)).toBe('Segunda-feira');
    });

    test('determinarDiaDeEntrega deve retornar "Indeterminado" para bairro não mapeado', () => {
        const bairroNaoMapeado = 'Desconhecido';
        expect(determinarDiaDeEntrega(bairroNaoMapeado)).toBe('Indeterminado');
    });
});
