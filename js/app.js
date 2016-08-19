$(function(){
		/* se ejecuta hasta que carga el Dom */
		// modelos
		var modelos = {
			numeros : [1,2,3,4],
			procesos : [
				{ letra: 'A', espacio:0 },
				{ letra: 'B', espacio:0 },
				{ letra: 'C', espacio:0 },
				{ letra: 'D', espacio:0 }
			],
			ejecucion : {
				espacio:10,
				procesos:[]
			},
			espera : [],
			titulo: 'Selecione una letra'
		};

		// controlador
		var controlador = {
			inicio:function () {
				vista.inicio();
			},
			ingrezar:function(n){
				if(isNaN(n)){

					var any = modelos.espera.some(function(e){
						return e.espacio === 0;
					});

					if(!any){
						modelos.procesos = modelos.procesos.filter(function(p){
							if(p.letra !== n){
								return p;
							}else{
								modelos.espera.push(p);
							}
						});
						modelos.titulo = 'Ahora seleciona un numero';
					}else{
						modelos.titulo = '¡Ya tienes una letra! Por favor intenta con un numero ';
					}

				}else{
					var index = modelos.espera.findIndex(function(e){
						return e.espacio === 0;
					});
					
					modelos.espera[index].espacio = n;

					if(modelos.ejecucion.espacio >= n){
						modelos.ejecucion.procesos.push(modelos.espera[index]);
						modelos.espera.splice(index, 1);
						modelos.ejecucion.espacio -= n;
					}			
					modelos.titulo = 'Selecione una letra';
				}

				vista.renderizar();
			},
			retornar:function(modelo){
				switch (modelo){
					case 'procesos':
						return recorer(modelos.procesos);
					case 'ejecucion':
						return recorer(modelos.ejecucion.procesos);
					case 'numeros':
						return modelos.numeros;
					case 'espera':
						return recorer(modelos.espera);
					case 'titulo':
						return modelos.titulo;
					case 'memoria':
						return modelos.ejecucion;
				}

				function recorer(v){
					return v.map(function(p){
						return p.letra;
					});
				}
			}	
		};

		// la vista
		var vista = {
			inicio: function() {

				this.template = $('#simpleDiv').html();

				$('.derecha').on('click', '.numeros > div, .letras > div',function(e){
					controlador.ingrezar(e.target.className);
				});

				var divs = new Array(controlador.retornar('memoria').espacio).fill('<div></div>');
				$('.memoria').append(divs);

				this.renderizar();
			},
			renderizar: function(){
				this.cargar(controlador.retornar('procesos'), $('.letras'));
				this.cargar(controlador.retornar('numeros'), $('.numeros'));
				this.cargar(controlador.retornar('espera'), $('#espera'));
				this.cargar(controlador.retornar('ejecucion'), $('#ejecucion'));

				this.memoria(controlador.retornar('memoria'));
				$('.titulo').text(controlador.retornar('titulo'));
			},
			cargar: function(temp, $element){
				var t = [];
				
				for (var i = 0; i < temp.length; i++) {
					t.push(this.template.replace(/{nombre}/g, temp[i]));
				}

				$element.html(t.join(''));
			},
			memoria: function(memoria){
				var procesos = memoria.procesos;
				var temp = 0; 
				for (var i = 0; i < procesos.length; i++) {
					temp += parseInt(procesos[i].espacio);
					console.log(temp);
					var selector = '.memoria > div:lt('+ temp +')';
					$(selector).addClass(procesos[i].letra);
				}
				
			}
		};

		controlador.inicio();
}());