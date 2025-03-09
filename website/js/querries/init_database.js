async function initDatabase() {
    const SQL = await initSqlJs();
    const binaryString = atob(databaseBase64);
    const byteArray = new Uint8Array(binaryString.length);
  
    for(let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    return new SQL.Database(byteArray);
}