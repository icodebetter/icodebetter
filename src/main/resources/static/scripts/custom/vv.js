
document.getElementById('loading-msg').innerHTML = 'Başlıyor...';

var _request={'_dont_throw':'1'}
var _scd={'customizerFlag':1
,'mainTemplateId':2
,'roleCount':6
,'locale':'tr'
,'myPageColumnCount':2
,'gmap_key':'ABQIAAAADSVx38a-APNUEMbS-g3FPRQcJuKZ514sUn3_Fshsh5BrQPhgwRT5iOv5w8Gl1l1vaVRiCByqLdilng'
,'userCustomizationId':122
,'roleDsc':'Full Yetkili'
,'userRoleId':306
,'userId':82
,'completeName':'Cenk AL'
,'userName':'cenk'
,'roleId':3
,'administratorFlag':1
,'mailAccountCount':1
,'unitDsc':'ProMIS'
,'customizationId':1
,'contactId':2382
,'userClientId':482
,'appVersion':'05.04.36 '
,'mngUserId':3
,'agendaId':160
,'unitId':482
,'userTip':2
,'mobile':0}
var _app={'new_page_on_click':'1'
,'debug':'1'
,'default_outbox_id':'201'
,'dealer_flag':'1'
,'record_watch_flag':'1'
,'form_modal_window':'0'
,'fin_tcmb_banka_kodlari':'1'
,'malzeme_matrix_price_flag':'1'
,'form_cancel_dirty_control':'1'
,'agenda_flag':'1'
,'feed_flag':'1'
,'feed_check_interval':'150'
,'grid_reset_btn':'1'
,'edit_grid_clicks_to_edit':'1'
,'crud_log_flag':'1'
,'client_para_tip':'1'
,'bpm_flag':'1'
,'system_log_expire_duration':'30'
,'file_attachment_flag':'1'
,'notification_flag':'1'
,'make_comment_flag':'1'
,'nakit_akis_para_tip_used':'dalis'
,'client_para_tip_used':'dsatis'
,'cut_takip_flag':'1'
,'form_approval_save_flag':'1'
,'malzeme_extra_ozellik_flag':'1'
,'thread_check_interval':'2000'
,'toolbar_edit_btn':'1'
,'request_wait_msg':'true'
,'mail_send_background_flag':'1'
,'show_info_msg':'1'
,'mail_flag':'1'
,'default_ulke':'227'
,'get_facebook_wall_feed_in_login':'1'}
var _lookups={para_tip:{'13':'SEK'
,'11':'NOK'
,'12':'SAR'
,'3':'USD'
,'2':'EUR'
,'1':'TRL'
,'10':'KWD'
,'7':'CAD'
,'6':'AUD'
,'5':'JPY'
,'4':'GBP'
,'9':'DKK'
,'8':'CHF'},
doviz_ref_tip4initalize:{'3':'ealis'
,'2':'dsatis'
,'1':'dalis'
,'4':'esatis'},
doviz_ref_tip:{'3':'Efektif Alış'
,'2':'Döviz Satış'
,'1':'Döviz Alış'
,'4':'Efektif Satış'}}

var pfrm_login={
 formId: 2,
 a:2,
 name:'Promis BMP',id:'promis__1312278537833',
 defaultWidth:600,
 defaultHeight:352,
 getExtDef:function(){
var mf={_formId:2,baseParams:{'_dont_throw':'1'},
labelAlign:'left',
labelWidth:100,url:'ajaxExecDbFunc'}
var _userName=mf._userName=new Ext.form.TextField({selectOnFocus:true,fieldLabel: 'Kullanıcı Adı',ctCls:'required',name: 'userName',allowBlank:false,width:150,value:'cenk',labelSeparator:'',_controlTip:1})
var _passWord=mf._passWord=new Ext.form.TextField({selectOnFocus:true,fieldLabel: 'Şifre',ctCls:'required',name: 'passWord',allowBlank:false,width:150,inputType:'password',labelSeparator:'',_controlTip:1})
var _locale=mf._locale=new Ext.form.ComboBox({labelSeparator:'',_controlTip:6,fieldLabel: 'Dil',ctCls:'required',hiddenName: 'locale',
store: new Ext.data.SimpleStore({id:0,fields:['id','dsc'],data:[['tr','Türkçe'],['en','English']]}),
valueField:'id',displayField:'dsc',typeAhead: false,mode: 'local',triggerAction: 'all',selectOnFocus:true,forceSelection:true,width:150,value:'tr',allowBlank:false})

var __anaBaslik__='promis_bmp'
var __action__=2
try{

if(_scd.userName){
_userName.setReadOnly(true);
_locale.setReadOnly(true);
}
}catch(e){if(e.stack)e.stack=null;alert(objProp(e))}
mf=Ext.apply(mf,{xtype:'form',border:false,
items:[{xtype:'fieldset',bodyStyle:'background-color: #DFE8F6;background-image:url(../images/custom/bubble.png);background-repeat:no-repeat',
items:[_userName,_passWord,_locale]}]});
return mf}}
var grd_select_role1_sm=new Ext.grid.RowSelectionModel({singleSelect:true})
var grd_select_role1 = {
 gridId:1,
 defaultWidth:500,
 defaultHeight:400,
 gridReport:false,
 saveUserInfo:false,
 loadMask:true,
 displayInfo:false,
 sm:grd_select_role1_sm,
 viewConfig:{}, plugins:[], name:'Rol Seçimi',
 id:'ng_1312278537834',
 listeners:{},
 ds:new Ext.data.JsonStore({url:'ajaxQueryData?_qid=1&_gid=1',root:'data',totalProperty:'browseInfo.totalCount',id:'user_role_id',fields:[{name:'user_role_id',type:'int'},
{name:'user_id',type:'int'},{name:'user_id_qw_'},
{name:'role_id',type:'int'},
{name:'active_flag',type:'int'},
{name:'unit_id',type:'int'},
{name:'version_no',type:'int'},
{name:'insert_user_id',type:'int'},{name:'insert_user_id_qw_'},
{name:'insert_dttm',type:'date',dateFormat:'d/m/Y h:i:s'},
{name:'version_user_id',type:'int'},{name:'version_user_id_qw_'},
{name:'version_dttm',type:'date',dateFormat:'d/m/Y h:i:s'},
{name:'customization_id',type:'int'},
{name:'role_id_qw_'},
{name:'unit_id_qw_'}],listeners:{loadexception:promisLoadException}}),
 autoExpandColumn:'unit_id'
}
grd_select_role1.columns=[{header: 'Rol', width: 200, dataIndex: 'role_id', id: 'role_id', sortable: true, renderer:gridQwRenderer('role_id')},
{header: 'Birim', width: 100, dataIndex: 'unit_id', id: 'unit_id', sortable: true, renderer:gridQwRenderer('unit_id')}]

var qry_gunluk_kur1={"success":true,"queryId":704,"execDttm":"03/08/2011 15:43:55",
"data":[{"para_tip":"1","work_dt":"02/08/2011 00:00:00","dalis":"1","dsatis":"1","ealis":"1","esatis":"1"},
{"para_tip":"2","work_dt":"02/08/2011 00:00:00","dalis":"2.3994","dsatis":"2.411","ealis":"2.3977001","esatis":"2.4145999"},
{"para_tip":"3","work_dt":"02/08/2011 00:00:00","dalis":"1.6917","dsatis":"1.6999","ealis":"1.6905","esatis":"1.7024"},
{"para_tip":"4","work_dt":"02/08/2011 00:00:00","dalis":"2.7520001","dsatis":"2.7664001","ealis":"2.7500999","esatis":"2.7704999"},
{"para_tip":"5","work_dt":"02/08/2011 00:00:00","dalis":"2.1837001","dsatis":"2.1982","ealis":"2.1756001","esatis":"2.2066"},
{"para_tip":"6","work_dt":"02/08/2011 00:00:00","dalis":"1.8349","dsatis":"1.8469","ealis":"1.8265001","esatis":"1.858"},
{"para_tip":"7","work_dt":"02/08/2011 00:00:00","dalis":"1.767","dsatis":"1.775","ealis":"1.7605","esatis":"1.7817"},
{"para_tip":"8","work_dt":"02/08/2011 00:00:00","dalis":"2.1687","dsatis":"2.1826999","ealis":"2.1654","esatis":"2.1860001"},
{"para_tip":"9","work_dt":"02/08/2011 00:00:00","dalis":"0.32201","dsatis":"0.3236","ealis":"0.32178","esatis":"0.32434"},
{"para_tip":"10","work_dt":"02/08/2011 00:00:00","dalis":"6.1367998","dsatis":"6.2175999","ealis":"6.0447001","esatis":"6.3109002"},
{"para_tip":"11","work_dt":"02/08/2011 00:00:00","dalis":"0.31283","dsatis":"0.31494","ealis":"0.31261","esatis":"0.31566"},
{"para_tip":"12","work_dt":"02/08/2011 00:00:00","dalis":"0.45246","dsatis":"0.45328","ealis":"0.44907","esatis":"0.45668"},
{"para_tip":"13","work_dt":"02/08/2011 00:00:00","dalis":"0.26479","dsatis":"0.26755","ealis":"0.2646","esatis":"0.26817"}],
"browseInfo":{"startRow":0,"fetchCount":0,"totalCount":13},
"sql":"select x.* from gen_doviz x where x.WORK_DT= (select max(work_dt) from gen_doviz d where d.para_tip=1) order by 1"}


var qry_user_menu1=[
{id:'mnu_22',text:'Ofis Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_92',text:'Çağrılar',href:'showPage?_tid=57',icon:'../images/famfam/telephone.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_32',text:'Görevler',href:'showPage?_tid=8',icon:'../images/custom/crm/03_gorev.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_117',text:'Masraf Çizelgeleri',href:'showPage?_tid=76&xcontrol=1',icon:'../images/custom/crm/04_masraf.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_125',text:'Evraklar',href:'showPage?_tid=77',icon:'../images/custom/crm/08_evrak.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_541',text:'Ziyaretçi Defteri',href:'showPage?_tid=598',icon:'../images/custom/crm/14_teklif.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_564',text:'Talep',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_566',text:'Avans Talep',href:'showPage?_tid=616',icon:'../images/custom/crm/49_avans.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_567',text:'İzin Talep',href:'showPage?_tid=617',icon:'../images/custom/crm/51_izin.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_565',text:'Malzeme Talep',href:'showPage?_tid=612',icon:'../images/custom/crm/53_sarf.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_577',text:'Satin Alma Talep(İşemri Yok)',href:'showPage?_tid=624&xcontrol=4&xsarf_talep_flag=1&xdurum=1',icon:'../images/custom/crm/31_talep.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]}]},
{id:'mnu_55',text:'Zaman Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_56',text:'Zaman Çizelgeleri',href:'showPage?_tid=41&xcontrol=1',icon:'../images/custom/crm/02_zaman.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_28',text:'CRM',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_23',text:'Firmalar',href:'showPage?_tid=9',icon:'../images/custom/crm/20_firmalar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_26',text:'Bağlantılar',href:'showPage?_tid=10',icon:'../images/custom/crm/22_baglanti.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_29',text:'Temaslar',href:'showPage?_tid=11',icon:'../images/custom/crm/01_crm.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_589',text:'Satış Etkinlik',href:'showPage?_tid=638',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_467',text:'İhale',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_132',text:'İhaleler',href:'showPage?_tid=80',icon:'../images/custom/crm/23_ihale.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_164',text:'Teklifler',href:'showPage?_tid=82',icon:'../images/custom/crm/14_teklif.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]}]},
{id:'mnu_178',text:'Stok Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_180',text:'Malzemeler',href:'showPage?_tid=95',icon:'../images/custom/crm/35_malzeme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_181',text:'Hareketler',href:'showPage?_tid=93',icon:'../images/custom/crm/36_hareket.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_184',text:'Rezerve Listesi',href:'showPage?_tid=97',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_202',text:'Lot Listesi',href:'showPage?_tid=106&xcontrol=1',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_547',text:'Fiyat Listesi',href:'showPage?_tid=601',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_603',text:'Sevk Planlama',href:'showPage?_tid=652',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_568',text:'STOK Giriş / Transfer',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_193',text:'Stok Sayımı',href:'showPage?_tid=603&xdepo_tip=1',icon:'../images/custom/crm/37_stok_sayim.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_615',text:'Giriş Bekleyen Malzemeler',href:'showPage?_tid=659',icon:'../images/famfam/door_open.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_552',text:'Depolar Arası Transfer',href:'showPage?_tid=607',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_573',text:'Stok Çıkış',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_606',text:'Yükleme / Sevk',href:'showPage?_tid=654&xstatus=2',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_574',text:'Ofis Kullanımı Çıkışı',href:'showPage?_tid=621&xstatus=1',icon:'../images/custom/crm/53_sarf.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_575',text:'İşemrine Malzeme Çıkışı',href:'showPage?_tid=623&xstatus=1',icon:'../images/custom/crm/50_malzeme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]}]},
{id:'mnu_224',text:'Satış Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_594',text:'Tüm Satışlar',href:'showPage?_tid=644',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_468',text:'Müşteri Siparişleri',href:'showPage?_tid=640',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_257',text:'Verilen Teklifler',href:'showPage?_tid=127',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_211',text:'Hızlı Satış',href:'showPage?_tid=113',icon:'../images/custom/crm/16_hizli_satis.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_34',text:'Proje Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_35',text:'Projeler',href:'showPage?_tid=12',icon:'../images/custom/crm/05_proje.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_112',text:'İş Geliştirme Projeleri',href:'showPage?_tid=75',icon:'../images/custom/crm/09_is_gelis.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_176',text:'Satın Alma Talepleri',href:'showPage?_tid=91&xcontrol=4&xdurum=1&xsarf_talep_flag=0',icon:'../images/custom/crm/31_talep.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_175',text:'Satın Alma Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_578',text:'Siparis Bekleyen Talepler',href:'showPage?_tid=626&xcontrol=4',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_621',text:'Onay Bekleyen Talepler',href:'showPage?_tid=665&xcontrol=4',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_505',text:'Satın Alma Teklifleri',href:'showPage?_tid=558',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_183',text:'Satın Alma Siparişleri',href:'showPage?_tid=96',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_614',text:'Mal Kabul / İrsaliye',href:'showPage?_tid=658',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_419',text:'İthalatlar',href:'showPage?_tid=478',icon:'../images/custom/crm/23_ihale.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_197',text:'Satın Alma Teklifleri Eski',href:'showPage?_tid=104',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_59',text:'Servis Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_469',text:'RMA',href:'showPage?_tid=110',icon:'../images/custom/crm/48_rma.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_209',text:'Teknik Servisler',href:'showPage?_tid=111',icon:'../images/custom/crm/06_servis.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_60',text:'Saha Servisleri',href:'showPage?_tid=43',icon:'../images/custom/crm/06_servis.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_95',text:'Servis Sözleşmeleri',href:'showPage?_tid=58',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_169',text:'Kiralama Sözleşmeleri',href:'showPage?_tid=86',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_470',text:'Üretim Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_489',text:'Üretim Planlama',href:'showPage?_tid=549&xtip=3',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_516',text:'Makina Bilgileri',href:'showPage?_tid=567',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_465',text:'İş Emirleri',href:'showPage?_tid=544',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_529',text:'Reçete Log Kayıtları',href:'showPage?_tid=586',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_570',text:'İşemri Malzeme',href:'showPage?_tid=618',icon:'../images/custom/crm/50_malzeme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_580',text:'Laboratuvar Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_619',text:'AR-GE',href:'showPage?_tid=663',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_562',text:'Kalite Kontrol',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_563',text:'Kalite Kontrol',href:'showPage?_tid=615',icon:'../images/custom/crm/26_sozlesme.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_252',text:'Dokümantasyon Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_240',text:'Dosya Yönetimi',href:'showPage?_tid=125',icon:'../images/custom/crm/25_dosya.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_48',text:'Bilgi Paylaşım Listesi',href:'showPage?_tid=38',icon:'../images/custom/crm/41_kb.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_44',text:'Dosyalar',href:'showPage?_tid=35',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_66',text:'Finans ve Ön Muhasebe Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_81',text:'Hesap Planı ve Bütçe',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_82',text:'Hesap Planı',href:'showPage?_tid=54',icon:'../images/custom/crm/46_hesap_plani.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_83',text:'Bütçe Planlaması',href:'showPage?_tid=55',icon:'../images/custom/crm/44_butce.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_131',text:'Proje Bütçe Listesi',href:'showPage?_tid=135&xcontrol=1',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_255',text:'Hareketler',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_104',text:'Kasa Hareketleri',href:'showPage?_tid=71&xcontrol=1',icon:'../images/custom/crm/45_kasa.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_85',text:'Nakit Akışı',href:'showPage?_tid=239',icon:'../images/custom/crm/10_finans.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_105',text:'Faturalar',href:'showPage?_tid=72',icon:'../images/custom/crm/47_fatura.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_230',text:'Hizmet Faturaları',href:'showPage?_tid=119',icon:'../images/custom/crm/47_fatura.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_256',text:'Bankalar',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_223',text:'Bankalar',href:'showPage?_tid=118',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_231',text:'Çekler',href:'showPage?_tid=120',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_232',text:'Krediler',href:'showPage?_tid=121',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_233',text:'Teminatlar',href:'showPage?_tid=122',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_129',text:'Raporlar',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_558',text:'Firma Borç Alacak Raporu',href:'showForm?_fid=1145',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_398',text:'Firma Borç  Alacak(N.A) ',href:'showForm?_fid=851',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_106',text:'Bankalar',href:'showForm?_fid=209&xfirma_id=482&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_107',text:'Cari İşlemler',href:'showForm?_fid=205&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_108',text:'Fatura Özeti',href:'showForm?_fid=210&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_88',text:'Nakit Akışı',href:'showForm?_fid=148&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_84',text:'Proje Finans (Muhasebe)',href:'showForm?_fid=140',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_80',text:'Proje Finans Özeti',href:'showForm?_fid=136',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_68',text:'Proje Satış ve Bütçe Bilgileri',href:'showForm?_fid=66',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_67',text:'Proje Kar / Zarar',href:'showForm?_fid=121',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_119',text:'Virmanlar',href:'showForm?_fid=234',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_115',text:'Hesap Planı',href:'showForm?_fid=222',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_87',text:'Bütçe',href:'showForm?_fid=145',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_267',text:'Satış Finans Analiz',href:'showForm?_fid=457',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_277',text:'Proje Borç/Alacak Durumu',href:'showForm?_fid=471',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_141',text:'Şirket Gazetesi',href:'showForm?_fid=123',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_479',text:'Malzeme Finans Hareketleri',href:'showForm?_fid=980',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_513',text:'Çek Takip',href:'showForm?_fid=1026',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_601',text:'Kasa Hareketleri',href:'showPage?_tid=650',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_587',text:'Kasalar',href:'showPage?_tid=636',icon:'../images/famfam/coins.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_588',text:'Bankalar',href:'showPage?_tid=637',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_591',text:'Teminatlar',href:'showPage?_tid=641',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_607',text:'Faturalar',href:'showPage?_tid=655',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_592',text:'Krediler',href:'showPage?_tid=642',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_593',text:'Çekler',href:'showPage?_tid=643',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_595',text:'Nakit Akışı',href:'showPage?_tid=645',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_597',text:'Hesaplar',href:'showPage?_tid=647',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_598',text:'Banka Talimatları',href:'showPage?_tid=648',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_612',text:'Kredi Kartları',href:'showPage?_tid=657',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_618',text:'Sevk Listesi',href:'showPage?_tid=662',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_43',text:'Raporlar',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_134',text:'Ofis Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_135',text:'Çağrı Merkezi',href:'showForm?_fid=165',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_136',text:'Görevler',href:'showForm?_fid=57&xcontrol=2',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_137',text:'Evrak Takibi',href:'showForm?_fid=239',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_138',text:'Masraf Çizelgesi',href:'showForm?_fid=229&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_515',text:'Evrak Takibi-2',href:'showForm?_fid=1029',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_228',text:'Zaman Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_139',text:'Zaman Çizelgesi',href:'showForm?_fid=94',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_140',text:'Aylık Zaman Çizelgesi',href:'showForm?_fid=100',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_142',text:'CRM',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_143',text:'Temas Devamları',href:'showForm?_fid=54',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_144',text:'Temas Özetleri',href:'showForm?_fid=52',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_145',text:'Pazarlama Takip',href:'showForm?_fid=61',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_259',text:'Müşteriler',href:'showForm?_fid=449',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_212',text:'Bağlantılar',href:'showForm?_fid=393',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_153',text:'Referanslar',href:'showForm?_fid=213&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_557',text:'Call Center Cevapları',href:'showForm?_fid=1142&',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_471',text:'Stok Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_166',text:'Malzeme Tanımları',href:'showForm?_fid=247',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_206',text:'Stok Durum Raporu',href:'showForm?_fid=370',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_157',text:'Stok Takibi',href:'showForm?_fid=119',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_473',text:'Satış Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2'},
{id:'mnu_146',text:'Proje Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_149',text:'Faturalanacak Malzemeler',href:'showForm?_fid=74&xcontrol=1',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_154',text:'Önemli Adımlar',href:'showForm?_fid=191',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_155',text:'Lot Takibi',href:'showForm?_fid=364',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_156',text:'Sevk Özetleri',href:'showForm?_fid=199',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_158',text:'Toplantı Detayları',href:'showForm?_fid=105&xobject_tip=6',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_161',text:'Satıcılar Alacak/Borç Raporu',href:'showForm?_fid=124',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_160',text:'İş Emirleri',href:'showForm?_fid=64',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_269',text:'Süreç Raporu',href:'showForm?_fid=459',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_499',text:'Süreç Analiz Raporu',href:'showForm?_fid=1001&sv_btn_visible=0',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_576',text:'Detaylı Süreç Raporu',href:'showForm?_fid=1204',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_502',text:'Zaman Çizelgesi Jasper',href:'showForm?_fid=1006&sv_btn_visible=0',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_600',text:'Devam Eden Proje Özetleri',href:'showForm?_fid=1291&sv_btn_visible=0',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_152',text:'Satın Alma Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_151',text:'Sipariş Listesi',href:'showForm?_fid=93&xcontrol=4',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_198',text:'Satıcı Malzemeleri',href:'showForm?_fid=343',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_147',text:'Servis Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_162',text:'Servis Sözleşmeleri',href:'showForm?_fid=217',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_150',text:'Servis İcmal',href:'showForm?_fid=224',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_204',text:'Sözleşme Maliyetleri',href:'showForm?_fid=366',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_509',text:'Servis Detay Raporu',href:'showForm?_fid=1017',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_472',text:'Üretim Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2'},
{id:'mnu_275',text:'Dokümantasyon Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_242',text:'Dokümantasyon',href:'showForm?_fid=442',icon:'../images/custom/crm/33_rapor.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]}]},
{id:'mnu_604',text:'İnsan Kaynakları Yönetimi',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_616',text:'Başvurular',href:'showPage?_tid=660',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_620',text:'Personel Listesi',href:'showPage?_tid=664',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_40',text:'Genel Tanımlar',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_497',text:'Kullanıcı Tanımlı Lookuplar',href:'showPage?_tid=541',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_128',text:'Süreç Şablonları',href:'showPage?_tid=79',icon:'../images/custom/crm/43_sablon.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_586',text:'Lokasyon Tanımları',href:'showPage?_tid=635',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_229',text:'Ofis Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_17',text:'Takım Listesi',href:'showPage?_tid=32',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_542',text:'Ziyaretçi Durum Tanımlama',href:'showPage?_tid=599',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_261',text:'CRM',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_12',text:'Anahtar Kelimeler',href:'showPage?_tid=29',icon:'../images/custom/crm/40_keyword.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_258',text:'Sektör Tanımları',href:'showPage?_tid=128',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_260',text:'Firma Giriş Nedeni Tanımları',href:'showPage?_tid=130',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_266',text:'Değerlendirme Tanımları',href:'showPage?_tid=132',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_440',text:'Firma Kart Tipleri',href:'showPage?_tid=519',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_560',text:'Teklif Hazırlama Süreçleri',href:'showPage?_tid=613',icon:'../images/custom/crm/40_keyword.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_553',text:'Soru Tanımları',href:'showPage?_tid=608',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_213',text:'Stok Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_179',text:'Depolar',href:'showPage?_tid=92',icon:'../images/custom/crm/34_depo.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_207',text:'İndirim Listesi Tanımı',href:'showPage?_tid=109',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_165',text:'Grup Tanımları',href:'showPage?_tid=83',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_203',text:'Kategori Tanımları',href:'showPage?_tid=107',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_182',text:'Depo Hareket Tipleri',href:'showPage?_tid=94',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_530',text:'Malzeme Fiyat Tip Tanımları',href:'showPage?_tid=587',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_579',text:'Fiyatlandırma Matrix',href:'showPage?_tid=628',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_476',text:'Satın Alma Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_274',text:'Satın Alma Onay Mekanizması',href:'showPage?_tid=137',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_439',text:'İthalat Süreç Şablonları',href:'showPage?_tid=498',icon:'../images/custom/crm/43_sablon.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_464',text:'Gerekli İthalat Belgeleri Şablonu',href:'showPage?_tid=542',icon:'../images/custom/crm/43_sablon.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_194',text:'Servis Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_210',text:'Arıza Tanımları',href:'showPage?_tid=112',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_195',text:'Sistem Cinsi Tanımları',href:'showPage?_tid=102',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_358',text:'Servis Gönderme Tipleri',href:'showPage?_tid=399',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_359',text:'Teknik Servis Tipleri',href:'showPage?_tid=400',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_196',text:'Malzeme Cinsi Tanımları',href:'showPage?_tid=103',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_378',text:'Teknik Servis Diagnosis Tanımları',href:'showPage?_tid=438',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_474',text:'Üretim Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_458',text:'Plan Adım',href:'showPage?_tid=538',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_493',text:'Reçete Tanımları',href:'showPage?_tid=552',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_511',text:'Makina Tanımları',href:'showPage?_tid=562',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_596',text:'Vardiya Tanımları',href:'showPage?_tid=646',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_581',text:'Laboratuvar Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_582',text:'Analiz Tanımları',href:'showPage?_tid=631',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_276',text:'Dokümantasyon Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_239',text:'Dosya Türleri Tanımları',href:'showPage?_tid=124',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_271',text:'Dosya Sistemi Tanımları',href:'showPage?_tid=136',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]},
{id:'mnu_263',text:'Finans ve Ön Muhasebe Yönetimi',href:'',icon:'',iconCls:'',cls:'',leaf:false,singleClickExpand:true,level:'2',children:[
{id:'mnu_214',text:'Muhasebe Kodları',href:'showPage?_tid=114',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_268',text:'Bütçe Tanımları',href:'showPage?_tid=134',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_466',text:'Bütçe Versiyon',href:'showPage?_tid=545',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_192',text:'TCMB Kurları',href:'showPage?_tid=100',icon:'../images/custom/crm/42_tcmb.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_583',text:'Banka & Şube Tanımları',href:'showPage?_tid=632',icon:'../images/famfam/building.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'},
{id:'mnu_590',text:'Tek Düzen Hesap Planı',href:'showPage?_tid=639',icon:'../images/famfam/text_list_numbers.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'3'}]}]},
{id:'mnu_270',text:'Genel İşlemler',href:'',icon:'',iconCls:'icon-pkg',cls:'package',leaf:false,singleClickExpand:true,level:'1',children:[
{id:'mnu_584',text:'Version Takibi',href:'showPage?_tid=633',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_534',text:'Excel Upload List',href:'showPage?_tid=592',icon:'../images/custom/crm/38_liste.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_461',text:'Hata/İstek Bildirimi',href:'showPage?_tid=540',icon:'../images/custom/crm/41_kb.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_548',text:'Takipteki Kayıtlar',href:'showPage?_tid=604',icon:'',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}]},
{id:'mnu_507',text:'Sistemde Ara',href:'showPage?_tid=559',icon:'../images/famfam/zoom.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'1'},
{id:'mnu_572',text:'BPM İş Akışları',href:'showPage?_tid=619',icon:'../images/custom/crm/39_tanimlar.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'1'}]


var qry_mail_menu1=[
{id:'mnus_147_147',text:'cenk@promis',href:'147',icon:'../images/famfam/email.png',iconCls:'',cls:'',leaf:'0',singleClickExpand:'0',level:'1',txt:'cenk@promis',children:[
{id:'mnus_147_-1',text:'Gelen Kutusu (13)',href:'-1',icon:'../images/custom/email1.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',txt:'Gelen Kutusu'},
{id:'mnus_147_-2',text:'Giden Kutusu',href:'-2',icon:'../images/custom/email2.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',txt:'Giden Kutusu'},
{id:'mnus_147_-3',text:'Gönderilmiş Öğeler',href:'-3',icon:'../images/custom/email3.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',txt:'Gönderilmiş Öğeler'},
{id:'mnus_147_-4',text:'Silinmiş Öğeler',href:'-4',icon:'../images/custom/email4.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',txt:'Silinmiş Öğeler'},
{id:'mnus_147_-5',text:'Taslaklar',href:'-5',icon:'../images/custom/email5.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',txt:'Taslaklar'}]}]


var qry_mail_other_menu1=[
{id:'mnus_163_163',text:'p4654-1001',href:'163',icon:'../images/famfam/email_delete.png',iconCls:'',cls:'',leaf:'0',singleClickExpand:'0',level:'1',newCount:'0',children:[
{id:'mnus_163_-1',text:'Gelen Kutusu',href:'-1',icon:'../images/custom/email1.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',newCount:'0'},
{id:'mnus_163_-2',text:'Giden Kutusu',href:'-2',icon:'../images/custom/email2.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',newCount:'0'},
{id:'mnus_163_-3',text:'Gönderilmiş Öğeler',href:'-3',icon:'../images/custom/email3.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',newCount:'0'},
{id:'mnus_163_-4',text:'Silinmiş Öğeler',href:'-4',icon:'../images/custom/email4.png',iconCls:'',cls:'',leaf:'1',singleClickExpand:'0',level:'2',newCount:'0'}]}]


var qry_agenda_menu1={"success":true,"queryId":1091,"execDttm":"03/08/2011 15:43:55",
"data":[{"id":"mnuc_160","text":"Ajandam","href":"160","icon":"../images/custom/icons/agenda.png","iconCls":"","cls":"","leaf":"0","singleClickExpand":"0","xlevel":"1"}],
"browseInfo":{"startRow":0,"fetchCount":0,"totalCount":1},
"sql":"select 'mnuc_'||x.agenda_id id\n,x.dsc text\n,x.agenda_id href\n,'../images/custom/icons/agenda'||decode(x.active_flag,0,'_inactive','')||'.png' icon\n,null iconCls\n,null cls\n,(case when x.agenda_id<0 then 1 else 0 end) leaf\n,0 singleClickExpand\n,1 xlevel from cal_object_agenda x where  ( x.table_id=336 AND x.table_pk=82 )  order by dsc"}


var qry_agenda_other_menu1={"success":true,"queryId":1092,"execDttm":"03/08/2011 15:43:55",
"data":[],
"browseInfo":{"startRow":0,"fetchCount":0,"totalCount":0},
"sql":"select 'mnuc_'||x.agenda_id id\n,(select u.dsc from w5_user u where u.user_id = x.table_pk)||' - '||x.dsc text\n,x.agenda_id href\n,'../images/custom/icons/agenda'||decode(x.active_flag,0,'_inactive','')||'.png' icon\n,null iconCls\n,null cls\n,(case when x.agenda_id<0 then 1 else 0 end) leaf\n,0 singleClickExpand\n,1 xlevel from cal_object_agenda x where  ( exists(select 1 from W5_TABLE_RELATED_RECORD tr where tr.table_id=651 AND tr.table_pk=x.agenda_id AND tr.related_table_id=336 AND tr.related_table_pk=82) )  order by dsc"}



function loginUserRole(userRoleId,userCustomizationId){
    Ext.Ajax.request({
        url:"ajaxSelectUserRole?userRoleId="+userRoleId+"&userCustomizationId="+userCustomizationId,
        success:function(){
            Ext.Msg.wait('Sisteme giriş yapılıyor','Lütfen bekleyin...');
            document.location='main.htm?.r='+new Date().getTime();
        }
    });
}
var lurw=null;
function selectUserRole(roleCount,defaultUserCustomizationId){
//    grd_select_role1.ds.un('loadexception');
    var gg=new Ext.grid.GridPanel(Ext.apply(grd_select_role1,{region: 'center',stripeRows: true,autoScroll:true,listeners:{rowdblclick:function(){loginUserRole(gg.getSelectionModel().getSelected().id, cb.getValue())
}}}));
    var cb = new Ext.form.ComboBox({width: 200, x:170, y:15, valueField:'id',displayField:'dsc', store: new Ext.data.JsonStore({url:'ajaxQueryData?_=_', baseParams: {_qid:'824'}, root:'data', autoLoad:true, totalProperty:'browseInfo.totalCount',id:'id',fields:[{name:'dsc'},
                {name:'id',type:'int'}],listeners:{loadexception:function(){if(lurw && lurw.isVisible()){lurw.destroy();showLoginDialog();}}, load: function(){cb.setValue(defaultUserCustomizationId);}}}), editable: false, typeAhead: false, mode:'local', triggerAction: 'all'});

    var pp = new Ext.Panel({region: 'north', layout:'absolute', height: 55, items: [new Ext.form.Label({text: 'Görünüm:', style:'font-size: 12px', x:100, y:17}), cb]});
    var lurw=new Ext.Window({
    modal:true,
    title:'Lütfen kullanmak istediğiniz rolü seçiniz',
    width: 500,
    height:300,
    border: false,
    layout: 'border',
    items:[pp,gg],
    buttons:[{text:'Seçiniz',handler:function(){
        var sel = gg.getSelectionModel().getSelected()
        if(!sel){
            alert('Önce birşeyler seçmelisiniz!')
            return
        }
        loginUserRole(sel.id,cb.getValue());
        }}]
    });
    gg.store.reload();
    lurw.show();
}

MenuPanel = function() {
    MenuPanel.superclass.constructor.call(this, {
        id:'api-tree',
        region:'center',
        border:false,
        header: false,
//        collapsible: true,
//        collapseMode:'mini',
//        margins:'0 0 5 5',
//        cmargins:'0 0 0 0',
        rootVisible:false,
        lines:false,
        autoScroll:true,
//        animCollapse:false,
        animate: false,
        loader: new Ext.tree.TreeLoader({
            preloadChildren: true,
            clearOnLoad: false
        }),
        root: new Ext.tree.AsyncTreeNode({
            text:'Promis BMP',
            id:'root',
            expanded:true,
            children:qry_user_menu1
         }),
        collapseFirst:false
    });

    this.getSelectionModel().on('beforeselect', function(sm, node){return node.isLeaf();});
};

Ext.extend(MenuPanel, Ext.tree.TreePanel, {
    initComponent: function(){
		this.hiddenPkgs = [];
		var ttbar=[' ', new Ext.form.TextField({
				width: _app.notification_flag && 1*_app.notification_flag ? 150:180,
				emptyText:'Ara',
				enableKeyEvents: true,
				listeners:{
					render: function(f){
						this.filter = new Ext.tree.TreeFilter(this, {
							clearBlank: true,
							autoClear: true
						});
					},
					keydown: {
						fn: this.filterTree,
						buffer: 350,
						scope: this
					},
					scope: this
				}
			}), ' ', ' ', {
				iconCls: 'icon-expand-all',
				tooltip: 'Hepsini Genişlet',
				handler: function(){ this.root.expand(true); },
				scope: this
			}, '-', {
				iconCls: 'icon-collapse-all',
				tooltip: 'Hepsini Daralt',
				handler: function(){ this.root.collapse(true); },
				scope: this
		}]
		if(_app.notification_flag && 1*_app.notification_flag){
			ttbar.push('-');
			ttbar.push({
				id:'id_not_icon',
				iconCls: 'icon-notification',
				text:'',
				tooltip: 'Bildirimler',
				handler: function(){ mainPanel.loadTab({attributes: {id: 'my_notifications', href: 'showPage?_tid=547'}}) },
				scope: this
			});
			ttbar.push({
				id:'id_not_label',
				xtype: 'label',hidden:true
			})
		}
			
		Ext.apply(this, {tbar:ttbar})
        MenuPanel.superclass.initComponent.call(this);
    },
    filterTree: function(t, e){
        var text = t.getValue();
        if(!text){
            this.filter.clear();
        this.collapseAll();
            return;
        }
        this.expandAll();
        
//        var re = new RegExp(Ext.escapeRe(text), 'i');
    var tqt=text.toLowerCase();
    var fxx=function(n){
        if(n.attributes.leaf){
            if(n.text.toLowerCase().indexOf(tqt)>-1){
                return true;
            } else if(n.parentNode && n.parentNode.text && n.parentNode.text.toLowerCase().indexOf(tqt)>-1){
                return true;
            }
        } else{
            if(n.text.toLowerCase().indexOf(tqt)>-1){
                return true;
            } else if(n.childNodes.length > 0)for(var qi=0;qi<n.childNodes.length;qi++){
                if(fxx(n.childNodes[qi]))return true;
            }
        }
        return  false;
        }
        this.filter.filterBy(fxx);
    }
});


var mainPanel = new Ext.TabPanel({
        id:'doc-body',
        region:'center',
        margins:'0 5 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        enableTabScroll: true,
        modalWindows:[],
        modalWindowCount:0,
        plugins: new Ext.ux.TabCloseMenu(),
        showModalWindow: function(w){
            w.show();
            mainPanel.modalWindows[mainPanel.modalWindowCount++] = w
            w.on('hide',mainPanel.destroyModalWindow)
        },
        closeModalWindow: function(){
            if(mainPanel.modalWindowCount>0){
                mainPanel.modalWindows[mainPanel.modalWindowCount-1].hide();
                return true;
            } else 
                return false;
        },  
        destroyModalWindow: function(){
            if(mainPanel.modalWindowCount>0){
                mainPanel.modalWindowCount--;
                mainPanel.modalWindows[mainPanel.modalWindowCount].destroy();
                delete mainPanel.modalWindows[mainPanel.modalWindowCount];
                return true;
            } else 
                return false;
        },  
        loadTab : function(n,e){
        if (n.attributes.href!=null) {
            if ((!e || !e.ctrlKey) &&  (n.attributes.id) && Ext.get("promis_"+n.attributes.id)){
                mainPanel.setActiveTab("promis_"+n.attributes.id);
                return;
            }else{
                var url=n.attributes.href// + '&.r=' + Math.random();
                if(1*_app.request_wait_msg)Ext.Msg.wait('Lütfen bekleyin')
                Ext.Ajax.request({
                    url: url,
                    success: function(o){
                        if(1*_app.request_wait_msg)Ext.Msg.hide()
                        var f=null;
                        try {
                            eval("f=function(callAttributes){"+o.responseText + '};');
                        } catch(e){//gelen string compile edilemiyor. ciddi hata
                            e.requestedUrl = url;
                            if(e.stack)e.stack=null;
                            if(url.indexOf('showPage')>-1){
                                if(confirm('Yapılan değişiklikler çalışmayı engelledi\n---------(\n'+objProp(e)+'\n)--------\nEskiye dönmek istermisiniz')){
                                    alert('Tamam');
                                }
                            } else {
                                alert(objProp(e));
                            }
                            return;
                        }
//                        try{//compile edildi, calistirma esnasinda problemler cikabilir
                            var mwf = (url.indexOf('showPage')>-1 || !(1*_app.form_modal_window)) && !n.attributes.modalWindow
                            var p =f(Ext.apply({modalWindowFlag:!mwf},n.attributes));
                            if(!p)return;
                            if(mwf){
                                if ((!e || !e.ctrlKey) && n.attributes.id)p.id='promis_'+n.attributes.id;
                                mainPanel.add(p);
                                mainPanel.setActiveTab(p);
                                if(p.refreshGrids){
                                    var arr = p.refreshGrids ;
                                    for(var i=0; i<arr.length; i++)arr[i].store.reload();
                                }
                            } else {
                                    var modalWindow = {
                                        modal:true,
                                        autoScroll:true,
                                        title:p._title_||'Form',
                                        width: p._width_ || 800,
                                        height:p._height_ || 600,
                                        items:p,
                                        listeners: {
                                            "resize": function(aq,bq,cq){
                                                if(typeof p.onresize == 'function'){
                                                    p.onresize(aq,bq,cq);
                                                }
                                            }
                                        }
                                    }    
                                if(p._windowCfg)modalWindow=Ext.apply(modalWindow, p._windowCfg)                    
                                mainPanel.showModalWindow(new Ext.Window(modalWindow))
                                if(p.refreshGrids){
                                    var arr = p.refreshGrids ;
                                    for(var i=0; i<arr.length; i++)arr[i].store.reload();
                                }
                            }
                            if(p.successCallback)p.successCallback(p);
/*                       } catch(e){
                            e.requestedUrl = url
                            if(e.stack)e.stack=null
                            alert(objProp(e))
                        }*/
                    },
                    failure: function(o){
                        if(1*_app.request_wait_msg)Ext.Msg.hide()
                        promisLoadException(o)
                    }
                });
            }
        }    
    }
});

function showEmails(xnode,xe){
    if(xnode.id=='mnus_mail_others'){
        mainPanel.loadTab({attributes:{id:'mnus_mail_others2',href:'showPage?_tid=570',_title_:'Diğer Eposta Hesapları'}},xe);
        return;
    }
    if(xnode.id=='mnus_compose_mail'){
        mainPanel.loadTab({attributes:{id:'mnus_compose_mail2',href:'showForm?_fid=650&_tableId=640&_tablePk='+_app.default_outbox_id,_title_:'Yeni EPosta'}},xe);
        return;
    }
    var oz=xnode.id.split('_')
    if(1*oz[2]<0){
        var mid='mail-'+oz[1];
        var mtab=Ext.get("promis_"+mid);
        if(!mtab)mainPanel.loadTab({attributes:{id:mid,href:'showPage?_tid=569&imail_folder_id='+(-1*oz[2])+'&imail_setting_id='+oz[1],_title_:xnode.parentNode.text}},xe);
        else {
            mainPanel.setActiveTab("promis_"+mid);
            var at=mainPanel.getActiveTab();
            if(at && at._callCfg){
                var g=at._callCfg.grid
                var fp=g.ds._formPanel;
                if(1*fp._xmail_folder_id.getValue()!=-1*oz[2]){
                    fp._xmail_folder_id.setValue(-1*oz[2]);
                    fp._xsearch_str.setValue('');
                }
                g.ds.reload();
            }
//            mtab.setTitle(xnode.text);
        }
    }
}

var menuPanel = null
var mainViewport = null
var mainMailTree = null
var qry_userx_setting1=[
{id:'mnu_72',text:'Bilgilerim',href:'showForm?_fid=131&a=1',icon:'../images/custom/crm/30_user_info.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'},
{id:'mnu_71',text:'Şifre Değiştir',href:'showForm?_fid=690',icon:'../images/custom/crm/28_sifre.png',iconCls:'',cls:'',leaf:true,singleClickExpand:false,level:'2'}];

function updateMenuNewMailCount(sidx,fidx,nmc){
    var mnu=mainMailTree.root.findChild('id','mnus_'+sidx+'_-'+fidx,true)
    if(mnu){
        mnu.setText(mnu.attributes.txt + (nmc ? ' ('+nmc+')':''));
    }
}

Ext.onReady(function(){    
    Ext.get("bmpHeader").dom.innerHTML = "Promis BMP (ver: "+_scd.appVersion+")";
    var roleXX ="";
    if(1*_scd.roleCount>1)roleXX+=_scd.userName+"&nbsp;<a href=# onclick='return selectUserRole(_scd.roleCount, _scd.userCustomizationId)' style='color:#FFFFFF;'>("+_scd.roleDsc+"/"+_scd.unitDsc+")</a>";
    else roleXX+=_scd.userName+" ("+_scd.roleDsc+"/"+_scd.unitDsc+")";
    Ext.get("switchRole").dom.innerHTML = roleXX;
    Ext.SSL_SECURE_URL="../images/ext3.3/default/s.gif"; 
    Ext.BLANK_IMAGE_URL="../images/ext3.3/default/s.gif";

    Ext.QuickTips.init();
           
    menuPanel = new MenuPanel();
    menuPanel.on('click', function(node, e){
         if(node.isLeaf()){
            e.stopEvent();
            mainPanel.loadTab(node,e);
         }
    });

    var item1 = new Ext.Panel({title: _scd.roleDsc,layout:'border',border:false,items:menuPanel});
        //
    var utree = new Ext.tree.TreePanel({
        containerScroll: true,
        border: false,
        rootVisible:false,
        lines:true,
        autoScroll:true,
        animate: false,
        loader: new Ext.tree.TreeLoader({
            preloadChildren: true,
            clearOnLoad: false
        }),
        root: new Ext.tree.AsyncTreeNode({
            text:'Promis BMP',
            id:'root',
            expanded:true,
            children:qry_userx_setting1
        })
    });
    utree.on('click', function(node, e){
        e.stopEvent();
        if(1*node.leaf!=0)mainPanel.loadTab(node,e);
    });
    var item3 = new Ext.Panel({
        title: 'Kullanıcı Ayarları',
        border:false,
        items:utree
    });
    
    var allItems=[item1, item3];
    if(_app.agenda_flag && 1*_app.agenda_flag){
        // Ajanda Menu Kendi
        var atree = new Ext.tree.TreePanel({
            containerScroll: true,
            border: false,
            rootVisible:false,
            lines:true,
            autoScroll:true,
            animate: false,
            title:'Kendi Ajandalarım',
            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
            }),
            root: new Ext.tree.AsyncTreeNode({
                text:'Promis BMP',
                id:'root',
                expanded:true,
                children:qry_agenda_menu1.data
            })
        });
        atree.on('click', function(node, e){
            e.stopEvent();
            screenSize = getScreenSize(); 
            openPopup('showPage?_tid=566&xagenda_id='+_scd.agendaId+'&xinclude_ids=50|86','_blank', screenSize.width*0.85, screenSize.height*0.90, 1); // Bu sonradan daha uyumlu hale getirilecek
            //if(1*node.leaf!=0)mainPanel.loadTab(node,e);
        });
        
        // Ajanda Menu Diğer
        
        qry_agenda_other_menu1x = new Array();
        qry_agenda_other_menu1x.push({id:'m_agenda_operations',text:'Diğer Ajandalar',href:'',iconCls:'icon-agenda_other',leaf:true,singleClickExpand:false,level:'1',newCount:'0'});
        for(var i=0; i<qry_agenda_other_menu1.data.length; i++){
            qry_agenda_other_menu1x.push(qry_agenda_other_menu1.data[i]);
        }
        
        var oatree = new Ext.tree.TreePanel({
            containerScroll: true,
            border: false,
            rootVisible:false,
            lines:true,
            autoScroll:true,
            animate: false,
            title:'Ajandalar',
            tbar: [{
                iconCls: 'icon-operation',
                tooltip: 'Operasyonlar',
                handler: function(){
                    var cfg={
                        attributes:{
                            modalWindow:true, 
                            href:'showPage?_tid=238&_gid1=881',
                            baseParams:{xrelated_table_id:336, xrelated_table_pk:_scd.userId, xtable_id: 651},
                            _pk:{ttable_related_record_id:'table_related_record_id'}
                        }
                    };
                    mainPanel.loadTab(cfg);
                },
                scope: this
            }],
            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
                }),
            root: new Ext.tree.AsyncTreeNode({
                text:'Promis BMP',
                id:'root',
                expanded:true,
                children:qry_agenda_other_menu1x
            })
        });
        
        oatree.on('click', function(node, e){
            e.stopEvent();
            var na = node.attributes;
            if(node.id != 'm_agenda_operations'){
                screenSize = getScreenSize(); 
                openPopup('showPage?_tid=566&xagenda_id='+na.href+'&xinclude_ids=50|86','_blank', screenSize.width*0.85, screenSize.height*0.90, 1);
            }
            else{
                na = node.attributes;
            }
            //if(1*node.leaf!=0)mainPanel.loadTab(node,e);
        });
        
        allItems.push(new Ext.Panel({
            title: 'Ajandam',
            border:false,
            autoScroll:true,
            items: [atree, oatree]
        }));
    }

    if(_app.mail_flag && 1*_app.mail_flag){
        var qitems=[],selMailSetId=null;
        var mailSettingMenu=new Ext.menu.Menu({enableScrolling:false, items:[
            {text:'Hesap Ayarları', handler:function(a,b,c){var idx=selMailSetId;mainPanel.loadTab({attributes: {id: 'mail_box-'+idx, href: 'showForm?a=1&_fid=1037&tmail_setting_id='+idx}});}}
            ,'-'
            ,{text:'Yeni Klasör', cls:'menu-fatura', handler:function(a,b,c){
                Ext.MessageBox.show({
                    title: 'Yeni Klasör',
                    msg: 'Lütfen yeni klasör adını giriniz:',
                    width:300,
                     prompt:true,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn: function(ax,bx,c){
                        if(ax=='ok'){
                            promisRequest({
                                url:'ajaxPostForm?_fid=1076&a=2',
                                params:{mail_setting_id:selMailSetId,dsc:bx}
                            }); 
                        }
                    }
                    ,animEl:a
                });
            }}
            ,{text:'Klasörleri Düzenle', handler:function(a,b,c){var idx=selMailSetId;mainPanel.loadTab({attributes:{modalWindow:true,id:'mail_box_folder-'+idx,href: 'showPage?_tid=238&_gid1=906',_pk:{tmail_folder_id:'mail_folder_id'},baseParams:{xmail_setting_id:idx}}});}}
        ]});
        for(var qi=0;qi<qry_mail_menu1.length;qi++)qry_mail_menu1[qi].listeners={contextmenu:function(node,e){
            node.select();
            selMailSetId=node.id.split('_')[1];
            e.stopEvent();
            mailSettingMenu.showAt(e.getXY());    
        }}
        for(var qi=0;qi<qry_mail_other_menu1.length;qi++)qry_mail_other_menu1[qi].listeners={contextmenu:function(node,e){
            node.select();
            selMailSetId=node.id.split('_')[1];
            e.stopEvent();
            mailSettingMenu.showAt(e.getXY());    
        }}
        qry_mail_menu1.push({id:'mnus_compose_mail',text:'Yeni Eposta',href:'showPage?_fid=650',iconCls:'icon-ekle',leaf:true,handler:function(){alert('yapicam');return false;}});
        
        mainMailTree = new Ext.tree.TreePanel({
            containerScroll: true,
            border: false,
            rootVisible:false,
            lines:true,
            autoScroll:true,
            animate: false,
            title:'Kendi Hesaplarım',
            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
            }),
            root: new Ext.tree.AsyncTreeNode({
                text:'Promis BMP',
                id:'root',
                expanded:true,
                children:qry_mail_menu1
            })
        });
        mainMailTree.on('click', function(node, e){
            e.stopEvent();
            if(1*node.leaf!=0)showEmails(node,e);
        });
        qitems.push(mainMailTree)
        qry_mail_other_menu1.push({id:'mnus_mail_others',text:'Diğer Ortak Hesaplar',href:'164',iconCls:'icon-email',leaf:true,singleClickExpand:false,level:'1',newCount:'0'});
        var otree = new Ext.tree.TreePanel({
            containerScroll: true,
            border: false,
            rootVisible:false,
            lines:true,
            autoScroll:true,
            animate: false,
            title:'Ortak Hesaplar',
        // auto create TreeLoader
            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
                }),
            root: new Ext.tree.AsyncTreeNode({
                text:'Promis BMP',
                id:'root',
                expanded:true,
                children:qry_mail_other_menu1
            })
        });
        otree.on('click', function(node, e){
            e.stopEvent();
            if(1*node.leaf!=0)showEmails(node,e);
        });
        qitems.push(otree);
        
        allItems.push(new Ext.Panel({
            title: 'Eposta Hesapları',
            border:false,
            items:qitems
        }));
    }

    var leftPanel = new Ext.Panel({
        region:'west',
        margins:'5 0 5 5',
        split:true,
        width: 250,
        minSize: 175,
        maxSize: 500,
        layout:'accordion',
        margins:'0 0 5 5',
        cmargins:'0 0 0 0',
        split:true,
        collapsible: true,
        collapseMode:'mini',
        items: allItems
    });

    mainViewport = new Ext.Viewport({
                layout:'border',
                items:[ {
                    cls: 'docs-header',
                    height: 36,
                    region:'north',
                    xtype:'box',
                    el:'header',
                    border:false,
                    margins: '0 0 5 0'
                }, leftPanel, mainPanel ]
    });

    menuPanel.expandPath('/root');
    mainViewport.doLayout();            
    mainPanel.loadTab({attributes: {id: 'sayfam', href: 'showPage?_tid=358'}});

    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);        
});