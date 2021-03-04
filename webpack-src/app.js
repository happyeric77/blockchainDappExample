const Web3 = require("web3")
const TodoList = require("../build/contracts/TodoList.json")

App = {
    web3: null,
    accounts: null,
    contract: null,

    load: async () => {
        await App.appendButtons()
    },

    appendButtons: async () => {
        const connectAccountButton = $('<button class="enableEthereumButton">Enable Ethereum</button>')
        connectAccountButton.on("click", async ()=>{
            await App.connectMetamask()
            App.web3 = await App.connectWeb3()           
        })
        connectAccountButton.appendTo("#app")

        const currentProviderButton = $('<button class="contract-button">provider Info</button>')
        currentProviderButton.on("click", ()=>{
            App.getCurrentProviderInfo()
        })
        currentProviderButton.appendTo("#app")

        const contractButton = $('<button class="contract-button">check contract</button>')
        contractButton.on("click", ()=>{
            App.loadContract()
        })
        contractButton.appendTo("#app")

        const getBalanceButton = $('<button class="contract-button">get Account Balance</button>')
        getBalanceButton.on("click", ()=>{
            App.getBalance()
        })
        getBalanceButton.appendTo("#app")

        const readAbiButton = $('<button class="contract-button">Read contract ABI</button>')
        readAbiButton.on("click", ()=>{
            App.callContractABI_read()
        })
        readAbiButton.appendTo("#app")

        const writeAbiButton = $('<button class="contract-button">write contract ABI</button>')
        writeAbiButton.on("click", ()=>{
            App.callContractABI_write()
        })
        writeAbiButton.appendTo("#app")
    },

    connectMetamask: async () => {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        alert(`Account connected: \n${accounts}`)
    },

    connectWeb3: async () => {
        // The Web3.givenProvider is given by Ethereum supported browser. 
        // In this case, metamask installed chrome.
        const web3 = await new Web3(Web3.givenProvider || "http://www.whole-new-world.ml:9876")
        /* If use below command, a list of account in network will be retreived
        ** var web3 = new Web3(new Web3.providers.HttpProvider('http://www.whole-new-world.ml:9876'))
        */
        
        // Get all Accounts
        web3.eth.getAccounts((err, acc)=>{
            App.accounts = acc
            $("#content").html("")
            $("<div>"+JSON.stringify(acc)+"</div>").appendTo("#content")
        })
        return web3
    },

    getCurrentProviderInfo: async () => {
        var currentProvider = await App.web3.currentProvider
        $("#content").html("")
        $("<div>"+JSON.stringify(currentProvider)+"</div>").appendTo("#content")
    },

    loadContract: async() => {
        var network_id = await App.web3.eth.net.getId()
        console.log(network_id)
        console.log(TodoList.networks)
        if (network_id) {    
            const contr = new App.web3.eth.Contract(TodoList.abi, TodoList.networks[network_id].address)    
            var abis = contr.options.jsonInterface
            var abiArry = []
            for(var i=0; i<abis.length; i++){
                if (abis[i].name) {
                    abiArry.push(abis[i].name)
                } 
            }  
            App.contract = contr
            $("#content").html("")
            $("<div>Contract address:"+contr.options.address+"</div> <div> ABI: "+ abiArry+"</div>").appendTo("#content")
        } else {
            alert("Failt to get network_id: check your network.")
        }                    
    },

    getBalance: async () => {
        // Get Wei unit of ether balance
        var weiBalance = await App.web3.eth.getBalance(App.accounts[0])        
        // Transform to ether unit
        balance = await App.web3.utils.fromWei(weiBalance, "ether")
        $("#content").html("")
        $("<div>"+weiBalance+" (Wei)</div> <div>"+ balance+"(Ether)</div>").appendTo("#content")
    },

    callContractABI_read: async () => {
        methods = App.contract.methods
        const taskcount = await methods.taskCount().call()
        console.log("Task count: " + taskcount)
        $("#content").html("")
        for (i = 0; i<parseInt(taskcount, 10); i++){
            task = await methods.tasks(i+1).call()
            $("<div>"+JSON.stringify(task)+"</div>").appendTo("#content")
        }        
    },
    
    callContractABI_write: async () => {
        var randomTask = Math.floor(Math.random()*100000000000000)
        var taskObj = {from: App.web3.eth.accounts.currentProvider.selectedAddress}
        await App.contract.methods.createTask(randomTask.toString()).send(taskObj)
        alert("Added a random task: " + randomTask)
    }
}

$(()=>{
    $(window).load(()=>{
        App.load()
    })
})