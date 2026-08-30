// ChatMaply direct-import hotfix: TXT, JSON and HTML are parsed without pretending unsupported formats contain locations.
import { parseWhatsApp } from '../parsers/whatsapp.js';
import { parseTelegramExport } from '../parsers/telegram.js';
import { parseSignalJSON, parseSignalText, detectSignalExport } from '../parsers/signal.js';
import { parseMessengerJSON, detectMessengerExport } from '../parsers/messenger.js';

const nameOf=file=>String(file?.name||'').toLowerCase();

function genericTextMessage(text,fileName){
  return [{id:`file-${Date.now()}`,sender:'Imported file',date:'',time:'',text:String(text||''),media:null,source:'direct-file',source_file:fileName}];
}

export async function inspectChatFile(file){
  if(!file)throw new Error('No chat export selected.');
  const name=nameOf(file);
  const text=await file.text();
  let messages=[];
  let parser='generic-text';
  let parser_status='PARSED';

  try{
    if(name.endsWith('.txt')){
      messages=parseWhatsApp(text);
      parser='whatsapp-txt';
    }else if(name.endsWith('.json')){
      const signal=detectSignalExport({name:file.name,text});
      const messenger=detectMessengerExport({name:file.name,text});
      if(signal==='signal-json'){messages=parseSignalJSON(text);parser='signal-json';}
      else if(messenger==='messenger-json'){messages=parseMessengerJSON(text);parser='messenger-json';}
      else {messages=parseTelegramExport(text);parser='telegram-json';}
    }else if(name.endsWith('.html')){
      const doc=new DOMParser().parseFromString(text,'text/html');
      const clean=doc.body?.textContent?.replace(/\s+/g,' ').trim()||'';
      messages=genericTextMessage(clean,file.name);
      parser='generic-html';
    }else throw new Error('Unsupported chat file. Use ZIP, TXT, JSON or HTML.');
  }catch(err){
    parser_status=err?.code==='INVALID_JSON'?'INVALID_JSON':'PARSER_ERROR';
    throw new Error(`${parser_status}: ${err.message||err}`);
  }

  return {
    fileName:file.name,totalFiles:1,files:[{name:file.name,mediaType:'other',size:file.size||0}],
    media:[],images:[],videos:[],messages,observers:[],parser,parser_status,chat_file:file.name,
    qa:{archive_readable:true,message_count:messages.length,media_count:0,unsupported_files:0}
  };
}
