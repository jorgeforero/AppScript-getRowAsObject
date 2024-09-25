
/**
 * getRowAsObject
 * Obtiene un objeto con los valores de la fila dada RowData. Toma los nombres de las llaves del parámtero Header. Las llaves
 * son dadas en minusculas y los espacios reemplazados por _
 * @param {array} RowData - Arreglo con los datos de la fila de la hoja
 * @param {array} Header - Arreglo con los nombres del encabezado de la hoja
 * @return {object} - Objeto con los datos de la fila dada y las propiedades nombradas de acuerdo a Header
 */
 function getRowAsObject( RowData, Header ) {
  let obj = {};
  for ( let indx=0; indx<RowData.length; indx++ ) {
    obj[ Header[ indx ].toLowerCase().replace( /\s/g, '_' ) ] = RowData[ indx ];
  };//for
  return obj;
};

/**
 * getRowAsObject2
 * Obtiene un objeto con los valores de la fila dada RowData. Toma los nombres de las llaves del parámtero Header. Las llaves
 * son dadas en minusculas y los espacios reemplazados por _. Acepta la creación de subobjetos dentro del objeto principal a partir de la definición
 * en el nombre de la columna con el formato: _<nombre llave ppal>::<nombre llave secundaria>
 * @param {array} RowData - Arreglo con los datos de la fila de la hoja
 * @param {array} Header - Arreglo con los nombres del encabezado de la hoja
 * @return {object} - Objeto con los datos de la fila dada y las propiedades nombradas de acuerdo a Header
 */
 function getRowAsObject2( RowData, Header ) {  
  let obj = {};
  let tempobj = {};
  let ref = '';
  // Recorre el arreglo de datos para generar el objeto
  for ( let indx=0; indx<RowData.length; indx++ ) {
    // Indicador de Objeto especial
    let subobj = {};
    let special = false;
    // Cuando el valor analizado es un subobjeto lo convierte a objeto
    if ( Header[ indx ].charAt(0) == '_' ) {
      // Procesa el nombre especial
      var parts = Header[ indx ].split( '::');
      // Primera parte para la llave ppal
      var keyppal = parts[ 0 ].slice( 1 ).toLowerCase().replace( /\s/g, '_' );
      // Segunda parte al nombre de la llave del subojeto
      let kepsec = parts[ 1 ].toLowerCase().replace( /\s/g, '_' );
      // lleva la referencia de que llave principal esta procesando  
      if ( ref != keyppal ) tempobj = {};
      // Genera la llave
      tempobj[ kepsec ] = RowData[ indx ];
      subobj = tempobj;
      special = true; 
    } else {
      subobj = RowData[ indx ];
    };
    // Va armando el objeto de acuerdo a si es una llave espacial o normal
    if ( special ) {
      obj[ keyppal] = subobj;
      // Actualiza la referencia de la llave ppal nueva 
      ref = keyppal;
    } else {
      obj[ Header[ indx ].toLowerCase().replace( /\s/g, '_' ) ] = subobj;
    };
  };//for
  return obj;
};

/**
 * listAthletes
 * Lista el Nombre de completo de cada atleta y su correspondiente dorsal
 * 
 * @param {void} - void
 * @return {void} - Listado de los atletas
 */
function listAthletes() {
  // Fuente de datos
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Obtiene el arreglo bidimensional con los datos
  let data = sheet.getDataRange().getDisplayValues();
  // Obtiene el Header
  let header = data.shift();
  // Listar los atletas usando los objetos generados por getRowAsObject2
  for ( let indx=0; indx<data.length; indx++ ) {
    let record = data[ indx ];
    let athlete = getRowAsObject2( record, header );
    // uso del objeto y las llaves para el despliegue - despliega también las llaves del subobjeto tiempos
    console.log( `Nombre: ${athlete.nombre} - Numero: ${athlete.dorsal} - Tiempo Pistola: ${athlete.tiempos.pistola}` );
  };
};
