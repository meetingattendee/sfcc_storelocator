var inquirer 		= require("inquirer"),
	ncp 			= require('ncp').ncp,
	replace 		= require("replace")
	fs 				= require('fs'),
	path 			= require('path'),
	mypath 			= '../../',
	sourceDir 		= 'store_locator',
	cpFile 			= '/cartridge/js/pages/storelocator.js'
	colors 			= require('colors'),
	cpmpletionMSG 	= {
						a:'Complted step 1... almost done...',
						b: colors.green('\n\n	************************************************************* \n' )
						+colors.yellow('	*	Congrats, your Store Locator is BORN. \n')
						+colors.yellow('	*	You can visit yourapp.com/stores to give it a try. \n')
						+colors.blue('	*	SFCC Store Locator v1.0.1 \n')
						+colors.green('	************************************************************* \n\n' )
					}

	var dirs = function(p){
		return fs.readdirSync(p).filter(
			function(f){
				if( f !='node_modules' && f.substring(0,1)!='.')
				return fs.statSync(path.join(p, f)).isDirectory();
			} 
		)
	}

	inquirer.prompt({
			type: "confirm",
		    name: "sfcc_type",
		    message: "Is this a SFCC mobile first application?",
		}).then( function(e) {
			if(e.core_cartridge)

				return console.error(colors.green('Sorry... this cartridge is not designed for a mobile first application yet. \n Please talk ask Brian to build you one he will love it!'));
			inquirer.prompt({
					type: "list",
				    name: "core_cartridge",
				    message: "Plese select you core cartridge:",
				    choices: dirs(mypath)
			}).then( function(a) {

				inquirer.prompt({
					type: "list",
					name: "app_cartridge",
					message: "Plese select you app cartridge:",
      				paginated: true,
					choices: dirs(a.core_cartridge)
				}).then(function(b){

					inquirer.prompt({
						type: "input",
						name: "where_dir",
						message: "Please enter a directory a name to use for this cartridge:",
						default: sourceDir
					}).then(function(c){

						var toThisDir 		= a.core_cartridge+'/'+sourceDir
						var fromThisFile 	= sourceDir+'/'+cpFile
						var toThisFile 		= a.core_cartridge+'/'+b.app_cartridge+cpFile
						
						if(c.where_dir!=sourceDir)
							toThisDir 		= a.core_cartridge+'/'+c.where_dir
						

						ncp(sourceDir, toThisDir, function (err) {
							if (err) {
							   return console.error(err);
							 }
							console.log('Directories created and files are moved ... next')
							if(c.where_dir!=sourceDir)
								replace({
								    regex: sourceDir,
								    replacement: c.where_dir,
								    paths: [a.core_cartridge+'/'+c.where_dir+'/.project'],
								    silent: true
								});
								console.log('Project file has been updated for new custom directory ... next')
						});


						ncp(fromThisFile, toThisFile, function (err) {
							if (err) {
							   return console.error(err);
							}
							console.log(cpmpletionMSG.b);
						});

					})


				})

			});

		});