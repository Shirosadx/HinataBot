module.exports = {
	// Você pode personalizar o idioma aqui ou diretamente nos arquivos de comando
	onlyadminbox: {
		description: "ativar/desativar modo apenas administradores do grupo podem usar o bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Modo apenas administradores do grupo podem usar o bot ATIVADO",
			turnedOff: "Modo apenas administradores do grupo podem usar o bot DESATIVADO",
			syntaxError: "Erro de sintaxe, use apenas {pn} on ou {pn} off"
		}
	},
	adduser: {
		description: "Adicionar usuário ao grupo",
		guide: "   {pn} [link do perfil | uid]",
		text: {
			alreadyInGroup: "Já está no grupo",
			successAdd: "- %1 membros adicionados com sucesso ao grupo",
			failedAdd: "- Falha ao adicionar %1 membros ao grupo",
			approve: "- %1 membros adicionados à lista de aprovação",
			invalidLink: "Por favor, insira um link válido do Facebook",
			cannotGetUid: "Não foi possível obter o UID deste usuário",
			linkNotExist: "Este URL de perfil não existe",
			cannotAddUser: "Bot está bloqueado ou este usuário bloqueou estranhos de adicionar ao grupo"
		}
	},
	admin: {
		description: "Adicionar, remover, editar função de administrador",
		guide: "   {pn} [add | -a] <uid>: Adicionar função de administrador para usuário\n\t  {pn} [remove | -r] <uid>: Remover função de administrador do usuário\n\t  {pn} [list | -l]: Listar todos os administradores",
		text: {
			added: "✅ | Função de administrador adicionada para %1 usuários:\n%2",
			alreadyAdmin: "\n⚠️ | %1 usuários já possuem função de administrador:\n%2",
			missingIdAdd: "⚠️ | Por favor, insira o ID ou marque o usuário para adicionar função de administrador",
			removed: "✅ | Função de administrador removida de %1 usuários:\n%2",
			notAdmin: "⚠️ | %1 usuários não possuem função de administrador:\n%2",
			missingIdRemove: "⚠️ | Por favor, insira o ID ou marque o usuário para remover função de administrador",
			listAdmin: "👑 | Lista de administradores:\n%1"
		}
	},
	adminonly: {
		description: "ativar/desativar modo apenas administradores podem usar o bot",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Modo apenas administradores podem usar o bot ATIVADO",
			turnedOff: "Modo apenas administradores podem usar o bot DESATIVADO",
			syntaxError: "Erro de sintaxe, use apenas {pn} on ou {pn} off"
		}
	},
	all: {
		description: "Marcar todos os membros do grupo",
		guide: "{pn} [conteúdo | vazio]"
	},
	anime: {
		description: "imagem de anime aleatória",
		guide: "{pn} <endpoint>\n   Lista de endpoints: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Inicializando imagem, por favor aguarde...",
			error: "Ocorreu um erro, por favor tente novamente mais tarde"
		}
	},
	antichangeinfobox: {
		description: "Ativar/desativar anti-alteração de informações do grupo",
		guide: "   {pn} avt [on | off]: anti-alteração de avatar do grupo\n   {pn} name [on | off]: anti-alteração de nome do grupo\n   {pn} theme [on | off]: anti-alteração de tema do grupo\n   {pn} emoji [on | off]: anti-alteração de emoji do grupo",
		text: {
			antiChangeAvatarOn: "Anti-alteração de avatar do grupo ATIVADO",
			antiChangeAvatarOff: "Anti-alteração de avatar do grupo DESATIVADO",
			missingAvt: "Você não definiu avatar para o grupo",
			antiChangeNameOn: "Anti-alteração de nome do grupo ATIVADO",
			antiChangeNameOff: "Anti-alteração de nome do grupo DESATIVADO",
			antiChangeThemeOn: "Anti-alteração de tema do grupo ATIVADO",
			antiChangeThemeOff: "Anti-alteração de tema do grupo DESATIVADO",
			antiChangeEmojiOn: "Anti-alteração de emoji do grupo ATIVADO",
			antiChangeEmojiOff: "Anti-alteração de emoji do grupo DESATIVADO",
			antiChangeAvatarAlreadyOn: "Seu grupo já está com anti-alteração de avatar ativado",
			antiChangeNameAlreadyOn: "Seu grupo já está com anti-alteração de nome ativado",
			antiChangeThemeAlreadyOn: "Seu grupo já está com anti-alteração de tema ativado",
			antiChangeEmojiAlreadyOn: "Seu grupo já está com anti-alteração de emoji ativado"
		}
	},
	appstore: {
		description: "Pesquisar aplicativo na App Store",
		text: {
			missingKeyword: "Você não inseriu nenhuma palavra-chave",
			noResult: "Nenhum resultado encontrado para a palavra-chave %1"
		}
	},
	autosetname: {
		description: "Alterar automaticamente o apelido de novos membros",
		guide: "   {pn} set <apelido>: usar para definir a configuração de alteração automática de apelido, com alguns atalhos:\n   + {userName}: nome do novo membro\n   + {userID}: ID do membro\n   Exemplo:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: usar para ativar/desativar este recurso\n\n   {pn} [view | info]: mostrar configuração atual",
		text: {
			missingConfig: "Por favor, insira a configuração necessária",
			configSuccess: "A configuração foi definida com sucesso",
			currentConfig: "A configuração atual do autoSetName no seu grupo é:\n%1",
			notSetConfig: "Seu grupo não definiu a configuração do autoSetName",
			syntaxError: "Erro de sintaxe, apenas \"{pn} on\" ou \"{pn} off\" podem ser usados",
			turnOnSuccess: "O recurso autoSetName foi ATIVADO",
			turnOffSuccess: "O recurso autoSetName foi DESATIVADO",
			error: "Ocorreu um erro ao usar o recurso autoSetName, tente desativar o recurso de link de convite no grupo e tente novamente mais tarde"
		}
	},
	avatar: {
		description: "criar avatar de anime com assinatura",
		guide: "{p}{n} <ID do personagem ou nome> | <texto de fundo> | <assinatura> | <nome da cor ou cor hex>\n{p}{n} help: ver como usar este comando",
		text: {
			initImage: "Inicializando imagem, por favor aguarde...",
			invalidCharacter: "Atualmente existem apenas %1 personagens no sistema, por favor insira um ID de personagem menor que",
			notFoundCharacter: "Nenhum personagem chamado %1 foi encontrado na lista de personagens",
			errorGetCharacter: "Ocorreu um erro ao obter dados do personagem:\n%1: %2",
			success: "✅ Seu avatar\nPersonagem: %1\nID: %2\nTexto de fundo: %3\nAssinatura: %4\nCor: %5",
			defaultColor: "padrão",
			error: "Ocorreu um erro\n%1: %2"
		}
	},
	badwords: {
		description: "Ativar/desativar/adicionar/remover aviso de palavras proibidas, se um membro violar, ele será avisado, na segunda vez será expulso do grupo",
		guide: "   {pn} add <palavras>: adicionar palavras proibidas (você pode adicionar várias palavras separadas por vírgulas \",\" ou barras verticais \"|\")\n   {pn} delete <palavras>: deletar palavras proibidas (você pode deletar várias palavras separadas por vírgulas \",\" ou barras verticais \"|\")\n   {pn} list <hide | deixar em branco>: desativar aviso (adicione \"hide\" para esconder palavras proibidas)\n   {pn} unwarn [<userID> | <@tag>]: remover 1 aviso de 1 membro\n   {pn} on: desativar aviso\n   {pn} off: ativar aviso",
		text: {
			onText: "ativado",
			offText: "desativado",
			onlyAdmin: "⚠️ | Apenas administradores podem adicionar palavras proibidas à lista",
			missingWords: "⚠️ | Você não inseriu as palavras proibidas",
			addedSuccess: "✅ | %1 palavras proibidas adicionadas à lista",
			alreadyExist: "❌ | %1 palavras proibidas já existiam na lista antes: %2",
			tooShort: "⚠️ | %1 palavras proibidas não podem ser adicionadas à lista porque são menores que 2 caracteres: %2",
			onlyAdmin2: "⚠️ | Apenas administradores podem deletar palavras proibidas da lista",
			missingWords2: "⚠️ | Você não inseriu as palavras para deletar",
			deletedSuccess: "✅ | %1 palavras proibidas deletadas da lista",
			notExist: "❌ | %1 palavras proibidas não existem na lista antes: %2",
			emptyList: "⚠️ | A lista de palavras proibidas do seu grupo está vazia",
			badWordsList: "📑 | Lista de palavras proibidas do seu grupo: %1",
			onlyAdmin3: "⚠️ | Apenas administradores podem %1 este recurso",
			turnedOnOrOff: "✅ | O aviso de palavras proibidas foi %1",
			onlyAdmin4: "⚠️ | Apenas administradores podem deletar avisos de palavras proibidas",
			missingTarget: "⚠️ | Você não inseriu ID do usuário ou marcou o usuário",
			notWarned: "⚠️ | O usuário %1 não foi avisado por palavras proibidas",
			removedWarn: "✅ | O usuário %1 | %2 teve 1 aviso de palavra proibida removido",
			warned: "⚠️ | Palavras proibidas \"%1\" foram detectadas em sua mensagem, se continuar violando será expulso do grupo.",
			warned2: "⚠️ | Palavras proibidas \"%1\" foram detectadas em sua mensagem, você violou 2 vezes e será expulso do grupo.",
			needAdmin: "O bot precisa de privilégios de administrador para expulsar membros que violaram",
			unwarned: "✅ | Aviso de palavra proibida do usuário %1 | %2 removido"
		}
	},
	balance: {
		description: "ver seu dinheiro ou o dinheiro da pessoa marcada",
		guide: "   {pn}: ver seu dinheiro\n   {pn} <@tag>: ver o dinheiro da pessoa marcada",
		text: {
			money: "Você tem %1$",
			moneyOf: "%1 tem %2$"
		}
	},
	batslap: {
		description: "Imagem de tapa de morcego",
		text: {
			noTag: "Você deve marcar a pessoa que deseja bater"
		}
	},
	busy: {
		description: "ativar modo não perturbe, quando você for marcado o bot irá notificar",
		guide: "   {pn} [vazio | <motivo>]: ativar modo não perturbe\n   {pn} off: desativar modo não perturbe",
		text: {
			turnedOff: "✅ | Modo não perturbe foi DESATIVADO",
			turnedOn: "✅ | Modo não perturbe foi ATIVADO",
			turnedOnWithReason: "✅ | Modo não perturbe foi ATIVADO com motivo: %1",
			alreadyOn: "O usuário %1 está ocupado no momento",
			alreadyOnWithReason: "O usuário %1 está ocupado no momento com motivo: %2"
		}
	},
	callad: {
		description: "enviar relatório, feedback, bug,... para o administrador do bot",
		guide: "   {pn} <mensagem>",
		text: {
			missingMessage: "Por favor, insira a mensagem que deseja enviar para o administrador",
			sendByGroup: "\n- Enviado do grupo: %1\n- ID do grupo: %2",
			sendByUser: "\n- Enviado pelo usuário",
			content: "\n\nConteúdo:\n─────────────────\n%1\n─────────────────\nResponda esta mensagem para enviar mensagem para o usuário",
			success: "Sua mensagem foi enviada para o administrador com sucesso!",
			reply: "📍 Resposta do administrador %1:\n─────────────────\n%2\n─────────────────\nResponda esta mensagem para continuar enviando para o administrador",
			replySuccess: "Sua resposta foi enviada para o administrador com sucesso!",
			feedback: "📝 Feedback do usuário %1:\n- ID do usuário: %2%3\n\nConteúdo:\n─────────────────\n%4\n─────────────────\nResponda esta mensagem para enviar mensagem para o usuário",
			replyUserSuccess: "Sua resposta foi enviada para o usuário com sucesso!"
		}
	},
	cmd: {
		description: "Gerenciar seus arquivos de comando",
		guide: "{pn} load <nome do arquivo>\n{pn} loadAll\n{pn} install <url> <nome do arquivo>: Baixar e instalar um arquivo de comando de uma url, url é o caminho para o arquivo (raw)",
		text: {
			missingFileName: "⚠️ | Por favor, insira o nome do comando que deseja recarregar",
			loaded: "✅ | Comando \"%1\" carregado com sucesso",
			loadedError: "❌ | Falha ao carregar o comando \"%1\" com erro\n%2: %3",
			loadedSuccess: "✅ | Comando \"%1\" carregado com sucesso",
			loadedFail: "❌ | Falha ao carregar o comando \"%1\"\n%2",
			missingCommandNameUnload: "⚠️ | Por favor, insira o nome do comando que deseja descarregar",
			unloaded: "✅ | Comando \"%1\" descarregado com sucesso",
			unloadedError: "❌ | Falha ao descarregar o comando \"%1\" com erro\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Por favor, insira a url ou código e o nome do arquivo de comando que deseja instalar",
			missingUrlOrCode: "⚠️ | Por favor, insira a url ou código do arquivo de comando que deseja instalar",
			missingFileNameInstall: "⚠️ | Por favor, insira o nome do arquivo para salvar o comando (com extensão .js)",
			invalidUrlOrCode: "⚠️ | Não foi possível obter o código do comando",
			alreadExist: "⚠️ | O arquivo de comando já existe, tem certeza que deseja sobrescrever o arquivo antigo?\nReaja a esta mensagem para continuar",
			installed: "✅ | Comando \"%1\" instalado com sucesso, o arquivo está salvo em %2",
			installedError: "❌ | Falha ao instalar o comando \"%1\" com erro\n%2: %3",
			missingFile: "⚠️ | Arquivo de comando \"%1\" não encontrado",
			invalidFileName: "⚠️ | Nome de arquivo inválido",
			unloadedFile: "✅ | Comando \"%1\" descarregado"
		}
	},
	count: {
		description: "Ver o número de mensagens de todos os membros ou de você mesmo (desde que o bot entrou no grupo)",
		guide: "   {pn}: usado para ver o número de mensagens suas\n   {pn} @tag: usado para ver o número de mensagens dos marcados\n   {pn} all: usado para ver o número de mensagens de todos os membros",
		text: {
			count: "Número de mensagens dos membros:",
			endMessage: "Aqueles que não têm nome na lista não enviaram nenhuma mensagem.",
			page: "Página [%1/%2]",
			reply: "Responda a esta mensagem com o número da página para ver mais",
			result: "%1 classificado em %2 com %3 mensagens",
			yourResult: "Você está classificado em %1 e enviou %2 mensagens neste grupo",
			invalidPage: "Número de página inválido"
		}
	},
	customrankcard: {
		description: "Personalize seu cartão de classificação",
		guide: {
			body: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <valor>"
				+ "\n   Onde: "
				+ "\n  + maincolor | background <valor>: fundo principal do cartão"
				+ "\n  + subcolor <valor>: fundo secundário"
				+ "\n  + linecolor <valor>: cor da linha entre o fundo principal e secundário"
				+ "\n  + expbarcolor <valor>: cor da barra de experiência"
				+ "\n  + progresscolor <valor>: cor da barra de experiência atual"
				+ "\n  + alphasubcolor <valor>: opacidade do fundo secundário (de 0 -> 1)"
				+ "\n  + textcolor <valor>: cor do texto (cor hex ou rgba)"
				+ "\n  + namecolor <valor>: cor do nome"
				+ "\n  + expcolor <valor>: cor da experiência"
				+ "\n  + rankcolor <valor>: cor da classificação"
				+ "\n  + levelcolor <valor>: cor do nível"
				+ "\n    • <valor> pode ser cor hex, rgb, rgba, gradiente (cada cor separada por espaço) ou url de imagem"
				+ "\n    • Se quiser usar gradiente, insira várias cores separadas por espaço"
				+ "\n   {pn} reset: redefinir tudo para o padrão"
				+ "\n   Exemplo:"
				+ "\n    {pn} maincolor #fff000"
				+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
				+ "\n    {pn} reset",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
			}
		},
		text: {
			invalidImage: "URL de imagem inválida, escolha uma URL com destino de imagem (jpg, jpeg, png, gif), você pode enviar a imagem para https://imgbb.com/ e escolher \"obter link direto\" para obter a URL",
			invalidAttachment: "Anexo inválido, escolha um arquivo de imagem",
			invalidColor: "Código de cor inválido, escolha um código de cor hex (6 dígitos) ou rgba",
			notSupportImage: "URL de imagem não é suportada com a opção \"%1\"",
			success: "Suas alterações foram salvas, aqui está uma prévia",
			reseted: "Todas as configurações foram redefinidas para o padrão",
			invalidAlpha: "Escolha um número de 0 -> 1"
		}
	},
	dhbc: {
		description: "jogo de adivinhação de palavras",
		guide: "{pn}",
		text: {
			reply: "Por favor, responda esta mensagem com a resposta\n%1",
			isSong: "Este é o nome da música do cantor %1",
			notPlayer: "⚠️ Você não é o jogador desta pergunta",
			correct: "🎉 Parabéns, você respondeu corretamente e recebeu %1$",
			wrong: "⚠️ Você respondeu incorretamente"
		}
	},
	emojimix: {
		description: "Misturar 2 emojis",
		guide: "   {pn} <emoji1> <emoji2>\n   Exemplo:  {pn} 🤣 🥰"
	},
	eval: {
		description: "Testar código rapidamente",
		guide: "{pn} <código para testar>",
		text: {
			error: "❌ Ocorreu um erro:"
		}
	},
	event: {
		description: "Gerenciar seus arquivos de comando de evento",
		guide: "{pn} load <nome do arquivo>\n{pn} loadAll\n{pn} install <url> <nome do arquivo>: Baixar e carregar comando de evento, url é o caminho para o arquivo de comando (raw)",
		text: {
			missingFileName: "⚠️ | Por favor, insira o nome do comando que deseja recarregar",
			loaded: "✅ | Comando de evento \"%1\" carregado com sucesso",
			loadedError: "❌ | Falha ao carregar o comando de evento \"%1\" com erro\n%2: %3",
			loadedSuccess: "✅ | Comando de evento \"%1\" carregado com sucesso",
			loadedFail: "❌ | Falha ao carregar o comando de evento \"%1\"\n%2",
			missingCommandNameUnload: "⚠️ | Por favor, insira o nome do comando que deseja descarregar",
			unloaded: "✅ | Comando de evento \"%1\" descarregado com sucesso",
			unloadedError: "❌ | Falha ao descarregar o comando de evento \"%1\" com erro\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Por favor, insira a url ou código e o nome do arquivo de comando que deseja instalar",
			missingUrlOrCode: "⚠️ | Por favor, insira a url ou código do arquivo de comando que deseja instalar",
			missingFileNameInstall: "⚠️ | Por favor, insira o nome do arquivo para salvar o comando (com extensão .js)",
			invalidUrlOrCode: "⚠️ | Não foi possível obter o código do comando",
			alreadExist: "⚠️ | O arquivo de comando já existe, tem certeza que deseja sobrescrever o arquivo antigo?\nReaja a esta mensagem para continuar",
			installed: "✅ | Comando de evento \"%1\" instalado com sucesso, o arquivo está salvo em %2",
			installedError: "❌ | Falha ao instalar o comando de evento \"%1\" com erro\n%2: %3",
			missingFile: "⚠️ | Arquivo \"%1\" não encontrado",
			invalidFileName: "⚠️ | Nome de arquivo inválido",
			unloadedFile: "✅ | Comando \"%1\" descarregado"
		}
	},
	filteruser: {
		description: "filtrar membros do grupo por número de mensagens ou conta bloqueada",
		guide: "   {pn} [<número de mensagens> | die]",
		text: {
			needAdmin: "⚠️ | Adicione o bot como administrador do grupo para usar este comando",
			confirm: "⚠️ | Tem certeza que deseja deletar membros do grupo com menos de %1 mensagens?\nReaja a esta mensagem para confirmar",
			kickByBlock: "✅ | %1 membros com conta bloqueada foram deletados com sucesso",
			kickByMsg: "✅ | %1 membros com menos de %2 mensagens foram deletados com sucesso",
			kickError: "❌ | Ocorreu um erro e não foi possível expulsar %1 membros:\n%2",
			noBlock: "✅ | Não há membros com conta bloqueada",
			noMsg: "✅ | Não há membros com menos de %1 mensagens"
		}
	},
	getfbstate: {
		description: "Obter o fbstate atual",
		guide: "{pn}",
		text: {
			success: "Fbstate enviado para você, verifique a mensagem privada do bot"
		}
	},
	grouptag: {
		description: "Marcar membros por grupo de marcação",
		guide: "   {pn} add <nomeDoGrupo> <@tags>: usar para adicionar novo grupo de marcação ou adicionar membros ao grupo\n   Exemplo:\n    {pn} TEAM1 @tag1 @tag2\n\n   {pn} del <nomeDoGrupo> <@tags>: usar para remover membros do grupo de marcação\n   Exemplo:\n    {pn} del TEAM1 @tag1 @tag2\n\n   {pn} remove <nomeDoGrupo>: usar para remover grupo de marcação\n   Exemplo:\n    {pn} remove TEAM1\n\n   {pn} rename <nomeDoGrupo> | <novoNome>: usar para renomear grupo de marcação\n\n   {pn} [list | all]: usar para ver a lista de grupos de marcação no seu grupo\n\n   {pn} info <nomeDoGrupo>: usar para ver informações do grupo de marcação",
		text: {
			noGroupTagName: "Por favor, insira o nome do grupo de marcação",
			noMention: "Você não marcou nenhum membro para adicionar ao grupo",
			addedSuccess: "Membros adicionados:\n%1\nao grupo de marcação \"%2\"",
			addedSuccess2: "Grupo de marcação \"%1\" adicionado com membros:\n%2",
			existedInGroupTag: "Membros:\n%1\njá existiam no grupo de marcação \"%2\"",
			notExistedInGroupTag: "Membros:\n%1\nnão existem no grupo de marcação \"%2\"",
			noExistedGroupTag: "O grupo de marcação \"%1\" não existe no seu grupo",
			noExistedGroupTag2: "Seu grupo ainda não adicionou nenhum grupo de marcação",
			noMentionDel: "Por favor, marque os membros para remover do grupo de marcação \"%1\"",
			deletedSuccess: "Membros removidos:\n%1\ndo grupo de marcação \"%2\"",
			deletedSuccess2: "Grupo de marcação \"%1\" removido",
			tagged: "Marcar grupo \"%1\":\n%2",
			noGroupTagName2: "Por favor, insira o nome antigo e o novo nome do grupo de marcação, separados por \"|\"",
			renamedSuccess: "Grupo de marcação renomeado de \"%1\" para \"%2\"",
			infoGroupTag: "📑 | Nome do grupo: \"%1\"\n👥 | Número de membros: %2\n👨‍👩‍👧‍👦 | Lista de membros:\n %3"
		}
	},
	help: {
		description: "Ver como usar os comandos",
		guide: "{pn} [vazio | <número da página> | <nome do comando>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Página [ %2/%3 ]\n│ Atualmente, o bot possui %4 comandos disponíveis\n│ » Digite %5help <página> para ver a lista de comandos\n│ » Digite %5help <nome do comando> para ver detalhes de uso\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Atualmente, o bot possui %2 comandos disponíveis\n│ » Digite %3help <nome do comando> para ver detalhes de uso\n│ %4\n╰─────────────⭓",
			commandNotFound: "O comando \"%1\" não existe",
			getInfoCommand: "╭── NOME ────⭓\n│ %1\n├── INFORMAÇÕES\n│ Descrição: %2\n│ Outros nomes: %3\n│ Outros nomes no seu grupo: %4\n│ Versão: %5\n│ Função: %6\n│ Tempo por comando: %7s\n│ Autor: %8\n├── USO\n%9\n├── NOTAS\n│ O conteúdo dentro de <XXXXX> pode ser alterado\n│ O conteúdo dentro de [a|b|c] é a ou b ou c\n╰──────⭔",
			doNotHave: "Não tem",
			roleText0: "0 (Todos os usuários)",
			roleText1: "1 (Administradores do grupo)",
			roleText2: "2 (Administrador do bot)",
			roleText0setRole: "0 (definir função, todos os usuários)",
			roleText1setRole: "1 (definir função, administradores do grupo)",
			pageNotFound: "A página %1 não existe"
		}
	},
	kick: {
		description: "Expulsar membro do grupo",
		guide: "{pn} @tags: usar para expulsar os membros marcados"
	},
	loadconfig: {
		description: "Recarregar a configuração do bot"
	},
	moon: {
		description: "ver imagem da lua na noite escolhida (dd/mm/aaaa)",
		guide: "  {pn} <dia/mês/ano>\n   {pn} <dia/mês/ano> <legenda>",
		text: {
			invalidDateFormat: "Por favor, insira uma data válida no formato DD/MM/AAAA",
			error: "Ocorreu um erro ao obter a imagem da lua de %1",
			invalidDate: "%1 não é uma data válida",
			caption: "- Imagem da lua em %1"
		}
	},
	notification: {
		description: "Enviar notificação do administrador para todos os grupos",
		guide: "{pn} <mensagem>",
		text: {
			missingMessage: "Por favor, insira a mensagem que deseja enviar para todos os grupos",
			notification: "Notificação do administrador do bot para todos os grupos (não responda a esta mensagem)",
			sendingNotification: "Iniciando envio de notificação do administrador para %1 grupos",
			sentNotification: "✅ Notificação enviada para %1 grupos com sucesso",
			errorSendingNotification: "Ocorreu um erro ao enviar para %1 grupos:\n %2"
		}
	},
	prefix: {
		description: "Alterar o prefixo do bot no seu grupo ou em todo o sistema (apenas administrador do bot)",
		guide: "   {pn} <novo prefixo>: alterar prefixo no seu grupo\n   Exemplo:\n    {pn} #\n\n   {pn} <novo prefixo> -g: alterar prefixo em todo o sistema (apenas administrador do bot)\n   Exemplo:\n    {pn} # -g\n\n   {pn} reset: redefinir prefixo do seu grupo para o padrão",
		text: {
			reset: "Seu prefixo foi redefinido para o padrão: %1",
			onlyAdmin: "Apenas administradores podem alterar o prefixo do sistema",
			confirmGlobal: "Reaja a esta mensagem para confirmar a alteração do prefixo do sistema",
			confirmThisThread: "Reaja a esta mensagem para confirmar a alteração do prefixo no seu grupo",
			successGlobal: "Prefixo do sistema alterado para: %1",
			successThisThread: "Prefixo do seu grupo alterado para: %1",
			myPrefix: "🌐 Prefixo do sistema: %1\n🛸 Prefixo do seu grupo: %2"
		}
	},
	rank: {
		description: "Ver seu nível ou o nível da pessoa marcada. Você pode marcar várias pessoas"
	},
	rankup: {
		description: "Ativar/desativar notificação de subida de nível",
		guide: "{pn} [on | off]",
		text: {
			syntaxError: "Erro de sintaxe, use apenas {pn} on ou {pn} off",
			turnedOn: "Notificação de subida de nível ATIVADA",
			turnedOff: "Notificação de subida de nível DESATIVADA",
			notiMessage: "🎉🎉 Parabéns por atingir o nível %1"
		}
	},
	refresh: {
		description: "atualizar informações do grupo ou usuário",
		guide: "   {pn} [thread | group]: atualizar informações do seu grupo\n   {pn} group <threadID>: atualizar informações do grupo por ID\n\n   {pn} user: atualizar informações do seu usuário\n   {pn} user [<userID> | @tag]: atualizar informações do usuário por ID",
		text: {
			refreshMyThreadSuccess: "✅ | Informações do seu grupo atualizadas com sucesso!",
			refreshThreadTargetSuccess: "✅ | Informações do grupo %1 atualizadas com sucesso!"
		}
	},
	rules: {
		description: "Criar/ver/adicionar/editar/alterar posição/deletar regras do grupo",
		guide: "   {pn} [add | -a] <regra a adicionar>: adicionar regra para o grupo.\n   {pn}: ver regras do grupo.\n   {pn} [edit | -e] <n> <conteúdo após editar>: editar regra número n.\n   {pn} [move | -m] <stt1> <stt2> trocar posição da regra <stt1> e <stt2>.\n   {pn} [delete | -d] <n>: deletar regra número n.\n   {pn} [remove | -r]: deletar todas as regras do grupo.\n\n   Exemplo:\n    {pn} add não spam\n    {pn} move 1 3\n    {pn} -e 1 não enviar spam no grupo\n    {pn} -r"
	},
	sendnoti: {
		description: "Criar e enviar notificações para grupos que você gerencia",
		guide: "   {pn} create <nomeDoGrupo>: Criar um novo grupo de notificação com o nome <nomeDoGrupo>\n   Exemplo:\n    {pn} create TEAM1\n\n   {pn} add <nomeDoGrupo>: adicionar o grupo atual ao grupo de notificação <nomeDoGrupo> (você deve ser administrador deste grupo)\n   Exemplo:\n    {pn} add TEAM1\n\n   {pn} delete: remover o grupo atual do grupo de notificação <nomeDoGrupo> (você deve ser o criador deste grupo)\n   Exemplo:\n    {pn} delete TEAM1\n\n   {pn} send <nomeDoGrupo> | <mensagem>: enviar notificação para todos os grupos no grupo de notificação <nomeDoGrupo> (você deve ser administrador desses grupos)\n   Exemplo:\n    {pn} remove TEAM1\n\n   {pn} remove <nomeDoGrupo>: remover o grupo de notificação <nomeDoGrupo> (você deve ser o criador do grupo de notificação <nomeDoGrupo>)\n   Exemplo:\n    {pn} remove TEAM1",
		text: {
			missingGroupName: "Por favor, insira o nome do grupo de notificação",
			groupNameExists: "O grupo de notificação com o nome %1 já foi criado por você antes, escolha outro nome",
			createdGroup: "Grupo de notificação criado com sucesso:\n- Nome: %1\n- ID: %2",
			missingGroupNameToAdd: "Por favor, insira o nome do grupo de notificação que deseja adicionar a este grupo",
			groupNameNotExists: "Você não criou/gerencia nenhum grupo de notificação com o nome: %1",
			notAdmin: "Você não é administrador deste grupo",
			added: "Grupo atual adicionado ao grupo de notificação: %1",
			missingGroupNameToDelete: "Por favor, insira o nome do grupo de notificação que deseja deletar desta lista",
			notInGroup: "O grupo atual não está no grupo de notificação %1",
			deleted: "Grupo atual removido do grupo de notificação: %1",
			failed: "Falha ao enviar notificação para %1 grupos: \n%2",
			missingGroupNameToRemove: "Por favor, insira o nome do grupo de notificação que deseja remover",
			removed: "Grupo de notificação removido: %1",
			missingGroupNameToSend: "Por favor, insira o nome do grupo de notificação para enviar a mensagem",
			groupIsEmpty: "O grupo de notificação \"%1\" está vazio",
			sending: "Enviando notificação para %1 grupos",
			success: "Notificação enviada para %1 grupos no grupo de notificação \"%2\" com sucesso",
			notAdminOfGroup: "Você não é administrador deste grupo",
			missingGroupNameToView: "Por favor, insira o nome do grupo de notificação que deseja ver informações",
			groupInfo: "- Nome do Grupo: %1\n - ID: %2\n - Criado em: %3\n%4 ",
			groupInfoHasGroup: "- Tem grupos: \n%1",
			noGroup: "Você não criou/gerencia nenhum grupo de notificação"
		}
	},
	setalias: {
		description: "Adicionar um apelido para qualquer comando no seu grupo",
		guide: "  Este comando é usado para adicionar/remover apelidos para qualquer comando no seu grupo\n   {pn} add <apelido> <comando>: adicionar um apelido para o comando no seu grupo\n   {pn} add <apelido> <comando> -g: adicionar um apelido para o comando em todo o sistema (apenas administrador do bot)\nExemplo:\n    {pn} add ctrk customrankcard\n\n   {pn} [remove | rm] <apelido> <comando>: remover um apelido para o comando no seu grupo\n   {pn} [remove | rm] <apelido> <comando> -g: remover um apelido para o comando em todo o sistema (apenas administrador do bot)\nExemplo:\n    {pn} rm ctrk customrankcard\n\n   {pn} list: listar todos os apelidos para comandos no seu grupo\n   {pn} list -g: listar todos os apelidos para comandos em todo o sistema"
	},
	setavt: {
		description: "Alterar avatar do bot",
		text: {
			cannotGetImage: "❌ | Ocorreu um erro ao consultar a URL da imagem",
			invalidImageFormat: "❌ | Formato de imagem inválido",
			changedAvatar: "✅ | Avatar do bot alterado com sucesso"
		}
	},
	setlang: {
		description: "Definir o idioma padrão do bot para o chat atual ou para todos os chats",
		guide: "   {pn} <código do idioma ISO 639-1\n   Exemplo:    {pn} en    {pn} vi    {pn} ja",
		text: {
			setLangForAll: "Idioma padrão definido para todos os chats: %1",
			setLangForCurrent: "Idioma padrão definido para o chat atual: %1",
			noPermission: "Apenas administradores do bot podem usar este comando"
		}
	},
	setleave: {
		description: "Editar conteúdo/ativar/desativar mensagem de saída quando um membro sair do grupo",
		guide: {
			body: "   {pn} on: Ativar mensagem de saída\n   {pn} off: Desativar mensagem de saída\n   {pn} text [<conteúdo> | reset]: editar conteúdo do texto ou redefinir para o padrão, atalhos disponíveis:\n  + {userName}: nome do membro que saiu\n  + {userNameTag}: nome do membro que saiu (tag)\n  + {boxName}: nome do grupo\n  + {type}: saiu/expulso pelo administrador\n  + {session}: período do dia\n\n   Exemplo:\n    {pn} text {userName} {type} do grupo, até logo 🤧\n\n   Responda ou envie uma mensagem com arquivo com o conteúdo {pn} file: para adicionar arquivo anexo à mensagem de saída\n\nExemplo:\n   {pn} file reset: redefinir arquivo",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setleave/setleave_en_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
			}
		},
		text: {
			missingContent: "Por favor, insira o conteúdo",
			edited: "Conteúdo da mensagem de saída do seu grupo editado para:\n%1",
			reseted: "Conteúdo da mensagem de saída redefinido",
			noFile: "Nenhum arquivo anexo da mensagem de saída para redefinir",
			resetedFile: "Arquivo anexo da mensagem de saída redefinido com sucesso",
			missingFile: "Por favor, responda esta mensagem com um arquivo de imagem/vídeo/áudio",
			addedFile: "%1 arquivo(s) anexo(s) adicionados à sua mensagem de saída"
		}
	},
	setname: {
		description: "Alterar apelido de todos os membros do chat ou membros marcados por um formato",
		guide: {
			body: "   {pn} <apelido>: alterar apelido de você mesmo\n   {pn} @tags <apelido>: alterar apelido dos membros marcados\n   {pn} all <apelido>: alterar apelido de todos os membros do chat\n\nCom atalhos disponíveis:\n   + {userName}: nome do membro\n   + {userID}: ID do membro\n\n   Exemplo: (ver imagem)",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_1.png`]: "https://i.ibb.co/gFh23zb/guide1.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/setname_2.png`]: "https://i.ibb.co/BNWHKgj/guide2.png"
			}
		},
		text: {
			error: "Ocorreu um erro, tente desativar o recurso de link de convite no grupo e tente novamente mais tarde"
		}
	},
	setrole: {
		description: "Editar função do comando (comandos com função < 2)",
		guide: "   {pn} <nomeDoComando> <nova função>: definir nova função para o comando\n   Com:\n   + <nomeDoComando>: nome do comando\n   + <nova função>: nova função do comando com:\n   + <nova função> = 0: comando pode ser usado por todos os membros do grupo\n   + <nova função> = 1: comando pode ser usado apenas por administradores\n   + <nova função> = default: redefinir função do comando para o padrão\n   Exemplo:\n    {pn} rank 1: (comando rank pode ser usado apenas por administradores)\n    {pn} rank 0: (comando rank pode ser usado por todos os membros do grupo)\n    {pn} rank default: redefinir para o padrão\n—————\n   {pn} [viewrole|view|show]: ver função dos comandos editados",
		text: {
			noEditedCommand: "✅ Seu grupo não tem comandos editados",
			editedCommand: "⚠️ Seu grupo tem comandos editados:\n",
			noPermission: "❗ Apenas administradores podem usar este comando",
			commandNotFound: "Comando \"%1\" não encontrado",
			noChangeRole: "❗ Não é possível alterar a função do comando \"%1\"",
			resetRole: "Função do comando \"%1\" redefinida para o padrão",
			changedRole: "Função do comando \"%1\" alterada para %2"
		}
	},
	setwelcome: {
		description: "Editar conteúdo da mensagem de boas-vindas quando um novo membro entrar no grupo",
		guide: {
			body: "   {pn} text [<conteúdo> | reset]: editar conteúdo do texto ou redefinir para o padrão, com alguns atalhos:\n  + {userName}: nome do novo membro\n  + {userNameTag}: nome do novo membro (tag)\n  + {boxName}: nome do grupo\n  + {multiple}: você || vocês\n  + {session}: período do dia\n\n   Exemplo:\n    {pn} text Olá {userName}, bem-vindo(a) ao {boxName}, tenha um bom {multiple} {session}\n\n   Responda ou envie uma mensagem com arquivo com o conteúdo {pn} file: para adicionar arquivos anexos à mensagem de boas-vindas (imagem, vídeo, áudio)\n\n   Exemplo:\n    {pn} file reset: deletar arquivos anexos",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/setwelcome/setwelcome_en_1.png`]: "https://i.ibb.co/vsCz0ks/setwelcome-en-1.png"
			}
		},
		text: {
			missingContent: "Por favor, insira o conteúdo da mensagem de boas-vindas",
			edited: "Conteúdo da mensagem de boas-vindas do seu grupo editado para: %1",
			reseted: "Conteúdo da mensagem de boas-vindas redefinido",
			noFile: "Nenhum arquivo anexo para deletar",
			resetedFile: "Arquivos anexos redefinidos com sucesso",
			missingFile: "Por favor, responda esta mensagem com um arquivo de imagem/vídeo/áudio",
			addedFile: "%1 arquivo(s) anexo(s) adicionados à mensagem de boas-vindas do seu grupo"
		}
	},
	shortcut: {
		description: "Adicionar um atalho para sua mensagem no grupo",
		text: {
			missingContent: 'Por favor, insira o conteúdo da mensagem',
			shortcutExists: 'O atalho "%1" já existe, reaja a esta mensagem para substituir o conteúdo do atalho',
			shortcutExistsByOther: 'O atalho %1 já foi adicionado por outro membro, tente outra palavra-chave',
			added: 'Atalho %1 => %2 adicionado',
			addedAttachment: ' com %1 anexo(s)',
			missingKey: 'Por favor, insira a palavra-chave do atalho que deseja deletar',
			notFound: 'Nenhum atalho encontrado para a palavra-chave %1 no seu grupo',
			onlyAdmin: 'Apenas administradores podem deletar atalhos de outras pessoas',
			deleted: 'Atalho %1 deletado',
			empty: 'Seu grupo ainda não adicionou nenhum atalho',
			message: 'Mensagem',
			attachment: 'Anexo',
			list: 'Lista de atalhos do seu grupo',
			onlyAdminRemoveAll: 'Apenas administradores podem remover todos os atalhos do grupo',
			confirmRemoveAll: 'Tem certeza que deseja remover todos os atalhos deste grupo? (reaja a esta mensagem para confirmar)',
			removedAll: 'Todos os atalhos do seu grupo foram removidos'
		}
	},
	simsimi: {
		description: "Conversar com o Simsimi",
		guide: "   {pn} [on | off]: ativar/desativar o Simsimi\n\n   {pn} <palavra>: conversar com o Simsimi\n   Exemplo:\n    {pn} oi",
		text: {
			turnedOn: "Simsimi ATIVADO com sucesso!",
			turnedOff: "Simsimi DESATIVADO com sucesso!",
			chatting: "Conversando com o Simsimi...",
			error: "O Simsimi está ocupado, tente novamente mais tarde"
		}
	},
	sorthelp: {
		description: "Ordenar a lista de ajuda",
		guide: "{pn} [name | category]",
		text: {
			savedName: "Ordenação da lista de ajuda por nome salva",
			savedCategory: "Ordenação da lista de ajuda por categoria salva"
		}
	},
	thread: {
		description: "Gerenciar grupos no sistema do bot",
		guide: "   {pn} [find | -f | search | -s] <nome para buscar>: buscar grupos nos dados do bot por nome\n   {pn} [find | -f | search | -s] [-j | joined] <nome para buscar>: buscar grupos nos dados do bot onde o bot ainda está presente por nome\n   {pn} [ban | -b] [<tid> | deixar em branco] <motivo>: usar para banir grupo com id <tid> ou grupo atual do bot\n   Exemplo:\n    {pn} ban 3950898668362484 spam no bot\n    {pn} ban spam demais\n    {pn} unban [<tid> | deixar em branco] para desbanir grupo com id <tid> ou grupo atual",
		text: {
			noPermission: "Você não tem permissão para usar este recurso",
			found: "🔎 %1 grupo(s) encontrado(s) com a palavra-chave \"%3\" nos dados do bot:\n%3",
			notFound: "❌ Nenhum grupo encontrado com a palavra-chave: \"%1\" nos dados do bot",
			hasBanned: "O grupo com id [%1 | %2] já foi banido antes:\n» Motivo: %3\n» Data: %4",
			banned: "Grupo com id [%1 | %2] banido de usar o bot.\n» Motivo: %3\n» Data: %4",
			notBanned: "O grupo com id [%1 | %2] não está banido",
			unbanned: "Grupo com tid [%1 | %2] desbanido",
			missingReason: "O motivo do ban não pode estar vazio",
			info: "» ID do grupo: %1\n» Nome: %2\n» Data de criação dos dados: %3\n» Total de membros: %4\n» Homens: %5 membros\n» Mulheres: %6 membros\n» Total de mensagens: %7%8"
		}
	},
	tid: {
		description: "Ver o ID do seu grupo",
		guide: "{pn}"
	},
	tik: {
		description: "Baixar vídeo/slide (imagem), áudio do link do TikTok",
		guide: "   {pn} [video|-v|v] <url>: usar para baixar vídeo/slide (imagem) do link do TikTok.\n   {pn} [audio|-a|a] <url>: usar para baixar áudio do link do TikTok",
		text: {
			invalidUrl: "Por favor, insira uma URL válida do TikTok",
			downloadingVideo: "Baixando vídeo: %1...",
			downloadedSlide: "Slide baixado: %1\n%2",
			downloadedVideo: "Vídeo baixado: %1\nURL de download: %2",
			downloadingAudio: "Baixando áudio: %1...",
			downloadedAudio: "Áudio baixado: %1"
		}
	},
	trigger: {
		description: "Imagem de gatilho",
		guide: "{pn} [@tag | vazio]"
	},
	uid: {
		description: "Ver o ID do usuário do Facebook",
		guide: "   {pn}: usar para ver seu próprio ID\n   {pn} @tag: ver o ID das pessoas marcadas\n   {pn} <link do perfil>: ver o ID do perfil",
		text: {
			syntaxError: "Marque a pessoa que deseja ver o UID ou deixe em branco para ver o seu próprio UID"
		}
	},
	unsend: {
		description: "Apagar mensagem do bot",
		guide: "responda a mensagem que deseja apagar e use o comando {pn}",
		text: {
			syntaxError: "Por favor, responda a mensagem que deseja apagar"
		}
	},
	user: {
		description: "Gerenciar usuários no sistema do bot",
		guide: "   {pn} [find | -f | search | -s] <nome para buscar>: buscar usuários nos dados do bot por nome\n\n   {pn} [ban | -b] [<uid> | @tag | responder mensagem] <motivo>: banir usuário com id <uid> ou usuário marcado ou remetente da mensagem respondida de usar o bot\n\n   {pn} unban [<uid> | @tag | responder mensagem]: desbanir usuário de usar o bot",
		text: {
			noUserFound: "❌ Nenhum usuário encontrado com o nome correspondente à palavra-chave: \"%1\" nos dados do bot",
			userFound: "🔎 %1 usuário(s) encontrado(s) com o nome correspondente à palavra-chave \"%2\" nos dados do bot:\n%3",
			uidRequired: "O UID do usuário para banir não pode estar vazio, insira o UID, marque ou responda a mensagem de 1 usuário com user ban <uid> <motivo>",
			reasonRequired: "O motivo para banir o usuário não pode estar vazio, insira o UID, marque ou responda a mensagem de 1 usuário com user ban <uid> <motivo>",
			userHasBanned: "O usuário com id [%1 | %2] já foi banido antes:\n» Motivo: %3\n» Data: %4",
			userBanned: "O usuário com id [%1 | %2] foi banido:\n» Motivo: %3\n» Data: %4",
			uidRequiredUnban: "O UID do usuário para desbanir não pode estar vazio",
			userNotBanned: "O usuário com id [%1 | %2] não está banido",
			userUnbanned: "O usuário com id [%1 | %2] foi desbanido"
		}
	},
	videofb: {
		description: "Baixar vídeo/story do Facebook (público)",
		guide: "   {pn} <url do vídeo/story>: baixar vídeo do Facebook",
		text: {
			missingUrl: "Por favor, insira a URL do vídeo/story do Facebook (público) que deseja baixar",
			error: "Ocorreu um erro ao baixar o vídeo",
			downloading: "Baixando vídeo para você",
			tooLarge: "Desculpe, não podemos baixar o vídeo porque o tamanho é maior que 83MB"
		}
	},
	warn: {
		description: "avisar membro no grupo, se tiver 3 avisos, será banido",
		guide: "   {pn} @tag <motivo>: avisar membro\n   {pn} list: ver lista de membros avisados\n   {pn} listban: ver lista de membros banidos\n   {pn} info [@tag | <uid> | deixar em branco]: ver informações de aviso do membro marcado ou UID ou você mesmo\n   {pn} unban <uid>: desbanir membro por UID\n   {pn} unwarn <uid> [<número do aviso> | deixar em branco]: remover aviso do membro por UID e número do aviso\n   {pn} warn reset: redefinir todos os dados de aviso\n⚠️ Você precisa definir o bot como administrador para expulsar automaticamente membros banidos",
		text: {
			list: "Lista de membros que foram avisados:\n%1\n\nPara ver os detalhes dos avisos, use o comando \"%2warn info [@tag | <uid> | deixar em branco]\" para ver as informações de aviso da pessoa marcada, UID ou você mesmo",
			listBan: "Lista de membros que foram avisados 3 vezes e banidos do grupo:\n%1",
			listEmpty: "Seu grupo não tem membros que foram avisados",
			listBanEmpty: "Seu grupo não tem membros banidos do grupo",
			invalidUid: "Por favor, insira um UID válido da pessoa que deseja ver as informações",
			noData: "Sem dados",
			noPermission: "❌ Apenas administradores do grupo podem desbanir membros banidos do grupo",
			invalidUid2: "⚠️ Por favor, insira um UID válido da pessoa que deseja desbanir",
			notBanned: "⚠️ O usuário com id %1 não foi banido do seu grupo",
			unbanSuccess: "✅ Membro [%1 | %2] desbanido com sucesso, agora esta pessoa pode entrar no seu grupo",
			noPermission2: "❌ Apenas administradores do grupo podem remover avisos de membros do grupo",
			invalidUid3: "⚠️ Por favor, insira um UID ou marque a pessoa que deseja remover o aviso",
			noData2: "⚠️ O usuário com id %1 não tem dados de aviso",
			notEnoughWarn: "❌ O usuário %1 tem apenas %2 avisos",
			unwarnSuccess: "✅ Aviso %1 do membro [%2 | %3] removido com sucesso",
			noPermission3: "❌ Apenas administradores do grupo podem redefinir dados de aviso",
			resetWarnSuccess: "✅ Dados de aviso redefinidos com sucesso",
			noPermission4: "❌ Apenas administradores do grupo podem avisar membros",
			invalidUid4: "⚠️ Você precisa marcar ou responder à mensagem da pessoa que deseja avisar",
			warnSuccess: "⚠️ Membro %1 avisado %2 vezes\n- UID: %3\n- Motivo: %4\n- Data/Hora: %5\nEste membro foi avisado 3 vezes e banido do grupo, para desbanir use o comando \"%6warn unban <uid>\" (com uid é o UID da pessoa que deseja desbanir)",
			noPermission5: "⚠️ O bot precisa de permissões de administrador para expulsar membros banidos",
			warnSuccess2: "⚠️ Membro %1 avisado %2 vezes\n- UID: %3\n- Motivo: %4\n- Data/Hora: %5\nSe esta pessoa violar mais %6 vezes, será banida do grupo",
			hasBanned: "⚠️ Os seguintes membros foram avisados 3 vezes antes e banidos do grupo:\n%1",
			failedKick: "⚠️ Ocorreu um erro ao expulsar os seguintes membros:\n%1"
		}
	},
	weather: {
		description: "ver a previsão do tempo atual e dos próximos 5 dias",
		guide: "{pn} <localização>",
		text: {
			syntaxError: "Por favor, insira uma localização",
			notFound: "Localização não encontrada: %1",
			error: "Ocorreu um erro: %1",
			today: "Clima de hoje:\n%1\n🌡 Temperatura mínima - máxima %2°C - %3°C\n🌡 Sensação térmica %4°C - %5°C\n🌅 Nascer do sol %6\n🌄 Pôr do sol %7\n🌃 Nascer da lua %8\n🏙️ Pôr da lua %9\n🌞 Dia: %10\n🌙 Noite: %11"
		}
	},
	ytb: {
		description: "Baixar vídeo, áudio ou ver informações do vídeo no YouTube",
		guide: "   {pn} [video|-v] [<nome do vídeo>|<link do vídeo>]: usar para baixar vídeo do YouTube.\n   {pn} [audio|-a] [<nome do vídeo>|<link do vídeo>]: usar para baixar áudio do YouTube\n   {pn} [info|-i] [<nome do vídeo>|<link do vídeo>]: usar para ver informações do vídeo no YouTube\n   Exemplo:\n    {pn} -v Fallen Kingdom\n    {pn} -a Fallen Kingdom\n    {pn} -i Fallen Kingdom",
		text: {
			error: "Ocorreu um erro: %1",
			noResult: "Nenhum resultado de pesquisa corresponde à palavra-chave %1",
			choose: "%1Responda à mensagem com o número para escolher ou qualquer conteúdo para cancelar",
			downloading: "Baixando vídeo %1",
			noVideo: "Desculpe, nenhum vídeo foi encontrado com tamanho menor que 83MB",
			downloadingAudio: "Baixando áudio %1",
			noAudio: "Desculpe, nenhum áudio foi encontrado com tamanho menor que 26MB",
			info: "💠 Título: %1\n🏪 Canal: %2\n👨‍👩‍👧‍👦 Inscritos: %3\n⏱ Duração: %4\n👀 Visualizações: %5\n👍 Curtidas: %6\n🆙 Data de upload: %7\n🔠 ID: %8\n🔗 Link: %9",
			listChapter: "\n📖 Lista de capítulos: %1\n"
		}
	}
};
