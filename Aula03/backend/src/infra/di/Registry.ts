// NOTA: Para mais informações sobre funcionamento: Leia no Notion > Aula 3 > Parte 02 Dependency Injection

export default class Registry {
    // define um tipo indexado de mapa de chaves e valores onde:
    // name é a chave do tipo string e qualquer valor pode ser armazenado
    // em resumo: é um dicionário (ou map) de dependências que mapeia nome para instâncias
    // ex: A chave é uma string ("accountDAO", "databaseConnection", etc) e o valor é a instância do objeto
    dependencies: { [name: string]: any } = {}; // inicializa o dicionário vazio
    static instance: Registry; // cria uma instancia única singleton que será usada por todo projeto

    private constructor () {
    }

    // é chamado pela Api.Ts para Registrar as Dependências no Container
    provide (name: string, dependency: any) {
        this.dependencies[name] = dependency;
    }

    // é chamado para injetar as dependências registradas no container
    inject (name: string) {
        const dependency = this.dependencies[name];
        if (!dependency) throw new Error(`Dependency: ${name} not found`);
        return dependency;
    }

    // cria uma única instância singleton e devolve sempre a mesma
    // na primeira chamada ele fará o new, depois devolerá sempre a mesma
    static getInstance () {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }

}

// Decorator de Injeção de Dependência - decorator em Typescript é uma função especial que pode ser usado para
// modificar classes, métodos, propriedades, etc em tempo de execução. Neste caso, ele é um property decorator,
// então quando um service chamar por exemplo:
//   @inject("accountDAO")
//   accountDAO!: AccountDAO;
// Ele passará o target protótipo de classe, e a propertyKey "accountDAO" que é o nome da propriedade
// O Decorator cria um PROXY (Design Pattern) - O proxy intercepta a chamada e busca a dependência real
// dentro do Registry e retorna a propriedade real do objeto. Ele atua como um delegador para a dependência real.
// O Proxy atua como um delegator inteligente: Busca a dependência Real no container, retorna o método real,
// encaminha a execucao.
export function inject (name: string) {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = new Proxy({}, {
            get (target: any, propertyKey: string) {
                const dependency =  Registry.getInstance().inject(name);
                return dependency[propertyKey];
            }
        })
    }
}
