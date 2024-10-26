const axios = require('axios');

async function listarItensDaPasta(siteId, driveId, itemId, token) {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${itemId}/children`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.data.value.length === 0) {
            console.log('A pasta está vazia.');
        } else {
            console.log('Itens dentro da pasta:', response.data.value);
        }
    } catch (error) {
        console.error('Erro ao listar itens da pasta:', error.response ? error.response.data : error.message);
    }
}

// Chame a função
const siteId = '3a80689a-8ce0-4577-bf7b-ee4381097dc1';
const driveId = 'b!mmiAOuCMd0W_e-5DgQl9wWVfIJ2rIK1MkSPIzi86-zeaaC8ebuvcTaqfImV_i6Jo';
const itemId = '01KXR56CN6VCDD3OM2MFEYTNVXBU6BGRRK'; // Exemplo de uma pasta
const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlRWeWxMSzkxaU5EalJUbzVfblkxa1hyYU51MFd1SklqeDRNektwQzF3MU0iLCJhbGciOiJSUzI1NiIsIng1dCI6Ikg5bmo1QU9Tc3dNcGhnMVNGeDdqYVYtbEI5dyIsImtpZCI6Ikg5bmo1QU9Tc3dNcGhnMVNGeDdqYVYtbEI5dyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83NGNhMzZjZC04Y2RiLTQ2NDctYjQ2ZC0wMzA0MjY4MDgyOWMvIiwiaWF0IjoxNzI3MTE2Mzk2LCJuYmYiOjE3MjcxMTYzOTYsImV4cCI6MTcyNzEyMDI5NiwiYWlvIjoiRTJkZ1lCQTRsaHJubnJ4dzA1My9BWFpiMm40a0FnQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJPcmdhbmljb3NEYUZhdGltYSBTaGFyZVBvaW50IEludGVncmF0aW9uIiwiYXBwaWQiOiI3OGQ0YThhMi04ZGM4LTQzNDYtYTBjNS1kZTNjYTFmYTdkNWUiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83NGNhMzZjZC04Y2RiLTQ2NDctYjQ2ZC0wMzA0MjY4MDgyOWMvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI3MTk2NmYyZS1lMGIzLTRhN2MtOTIxNy0zNDNkYjliNmU0NzYiLCJyaCI6IjAuQWJjQXpUYktkTnVNUjBhMGJRTUVKb0NDbkFNQUFBQUFBQUFBd0FBQUFBQUFBQURKQUFBLiIsInJvbGVzIjpbIkZpbGVzLlJlYWRXcml0ZS5BcHBGb2xkZXIiLCJTaXRlcy5TZWxlY3RlZCIsIkZpbGVzLlNlbGVjdGVkT3BlcmF0aW9ucy5TZWxlY3RlZCIsIlNpdGVzLlJlYWQuQWxsIiwiU2l0ZXMuUmVhZFdyaXRlLkFsbCIsIlNpdGVzLk1hbmFnZS5BbGwiLCJGaWxlcy5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZC5BbGwiLCJTaXRlcy5GdWxsQ29udHJvbC5BbGwiXSwic3ViIjoiNzE5NjZmMmUtZTBiMy00YTdjLTkyMTctMzQzZGI5YjZlNDc2IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IlNBIiwidGlkIjoiNzRjYTM2Y2QtOGNkYi00NjQ3LWI0NmQtMDMwNDI2ODA4MjljIiwidXRpIjoiaEp5OXZSRzBMMEsycFBtWXd4Y2pBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc19pZHJlbCI6IjcgNiIsInhtc190Y2R0IjoxNjk4ODUzMDYzfQ.ZTRD7XtOLPwgtxz3PWqmeCkYVuVQryn_NX0R37w4lMnr5rc6Llqe-kkuHjN-8UmSAn5OCqKn2cDJn-179OwsXDbxgsbX953_oRflKNWCMU_FOT43HSenYyt4dgYDzSiVMWNgWdnNIP5YAaHjTIWhlnkFmvXX6AFuoPokre01ZD8Purb-KRZf4Q-pyRvISikYTDnUdg9kY3ZxK_IEG5cTRQPf6dqJ9UHE7T-0SBl8P9ScEgIc79YYMdYSyZaIki_55trNo1ypirjxqCzk8Hjnt_-tTM07nDmeR6YurapFBlDzbBsU1X2ER9anYfPhCCxwLdzuxZfGg6EATJjATyS56w';

listarItensDaPasta(siteId, driveId, itemId, token);
