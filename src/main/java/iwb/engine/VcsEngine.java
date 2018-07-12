package iwb.engine;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//import org.codehaus.jackson.map.ser.impl.SimpleBeanPropertyFilter.FilterExceptFilter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import iwb.custom.trigger.QueryTrigger;
import iwb.dao.RdbmsDao;
import iwb.domain.db.Log5VcsAction;
import iwb.domain.db.W5Customization;
import iwb.domain.db.W5Project;
import iwb.domain.db.W5QueryField;
import iwb.domain.db.W5Table;
import iwb.domain.db.W5TableChild;
import iwb.domain.db.W5VcsCommit;
import iwb.domain.db.W5VcsObject;
import iwb.domain.helper.W5TableRecordHelper;
import iwb.domain.result.W5QueryResult;
import iwb.exception.IWBException;
import iwb.util.DBUtil;
import iwb.util.FrameworkCache;
import iwb.util.FrameworkSetting;
import iwb.util.GenericUtil;
import iwb.util.HttpUtil;
import iwb.util.UserUtil;

@Service
@Transactional
public class VcsEngine {
	@Autowired
	private RdbmsDao dao;

	synchronized public Map vcsClientObjectPull(Map<String, Object> scd, int tableId, int tablePk, boolean force) {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectPull",0,null, "VCS Server not allowed to vcsClientObjectPull", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPull", 0, projectUuid, "No VCS for this Project2", null);
		}
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPull", t.getTableId(), po.getProjectUuid()+"!="+projectUuid, "Not VCS Table2", null);
		}
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&t="+tableId+"&k="+tablePk+"&r="+po.getProjectUuid();
		
		List lv = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", tableId, tablePk, customizationId, projectUuid);
		W5VcsObject vo = null;
		Map result = new HashMap();
		result.put("success", true);
		if(!lv.isEmpty()){
			vo = (W5VcsObject)lv.get(0);
			if(vo.getVcsObjectStatusTip()==2 && !force){
			//	throw new PromisException("vcs","vcsClientObjectPull", vo.getVcsCommitId(), null, "Object is New. Cannot be Pulled2", null);
				result.put("error", "force");
				result.put("error_msg", "Object is New. Cannot be Pulled2");
				return result;
			}
			urlParameters+="&o="+vo.getVcsCommitId();
		} else {
			vo = new W5VcsObject(scd, tableId, tablePk);
			vo.setTableId(tableId);
			vo.setTablePk(tablePk);
			vo.setProjectUuid(projectUuid);
			vo.setCustomizationId(customizationId);
		}

		
		if(vo.getVcsObjectStatusTip()==1 && !force){ //conflicts: edited but wants to pull
			result.put("error", "force");
			result.put("error_msg", "Conflicts");
			return result;
		}
		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectPull";
		String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
//					String sql =json.getString("sql");
					int action = json.getInt("action");
					JSONObject jo =action == 3 ? null:json.getJSONObject("object");
					int srvVcsCommitId = json.getInt("commit_id");
					int srvCommitUserId = json.getInt("user_id");
					
					dao.saveVcsObject(scd, tableId, tablePk, action, jo);

					vo.setVcsObjectStatusTip((short)9);
					vo.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, tableId, tablePk));
					
					if(vo.getVcsObjectId()==0){
						vo.setVcsCommitId(srvVcsCommitId);
						vo.setInsertUserId(srvCommitUserId);
						dao.saveObject(vo);
					} else {
						vo.setVersionNo((short)(vo.getVersionNo()+1));
						vo.setVersionUserId(srvCommitUserId);
						vo.setVcsCommitId(srvVcsCommitId);
						vo.setVersionDttm(new Timestamp(new Date().getTime()));
						dao.updateObject(vo);
					}
					
//					JSONArray d =json.getJSONArray("detail"); TODO
				} else
					throw new IWBException("vcs","vcsClientObjectPull:server Error Response", t.getTableId(), s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectPull:JSONException", t.getTableId(), s, e.getMessage(), e.getCause());
			}
		}
		return result;
	}
	
	synchronized public Map vcsClientObjectPullMulti(Map<String, Object> scd, String tableKeys, boolean force, boolean continueOnFail) {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectPullMulti",0,null, "VCS Server not allowed to vcsClientObjectPullMulti", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPullMulti", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		String[] arTableKeys = tableKeys.split(",");
		
		
//		List lo = new ArrayList();
		JSONArray jlo = new JSONArray();
		Map<String, W5VcsObject> voMap = new HashMap();
		Map result = new HashMap();
		result.put("success", true);
		StringBuilder keyz = new StringBuilder();// + "&k="+tableKeys
		int counter=0;
		for(String k:arTableKeys){
			String[] tableKey = k.replace('.', ',').split(",");
			int tableId=GenericUtil.uInt(tableKey[0]);
			W5Table t = FrameworkCache.getTable(customizationId, tableId);
			if(t.getVcsFlag()==0){
				continue;
			}
			keyz.append(",").append(k);
			int tablePk = GenericUtil.uInt(tableKey[1]);
			List lv = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", tableId, tablePk, customizationId, projectUuid);
			W5VcsObject vo = null;
			if(!lv.isEmpty()){
				vo = (W5VcsObject)lv.get(0);
				if(vo.getVcsObjectStatusTip()==2 && !force){
					if(continueOnFail)continue;
					//	throw new PromisException("vcs","vcsClientObjectPull", vo.getVcsCommitId(), null, "Object is New. Cannot be Pulled2", null);
					result.put("error", "force");
					result.put("error_msg", "Object is New. Cannot be Pulled2");
					return result;
				}
				keyz.append(".").append(vo.getVcsCommitId());
				vo.setVersionDttm(new Timestamp(new Date().getTime() + counter++));
			} else {
			
				vo = new W5VcsObject(scd, tableId, tablePk);
				vo.setTableId(tableId);
				vo.setTablePk(tablePk);
				vo.setCustomizationId(customizationId);
			}
			voMap.put(vo.getTableId()+"." + vo.getTablePk(), vo);
			
		}
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&k="+keyz.substring(1);

		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectPullMulti";
		String s = HttpUtil.send(url, urlParameters);
		

		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONArray ja = json.getJSONArray("data");
					for(int qi=0;qi<ja.length();qi++)try{
						JSONObject o = ja.getJSONObject(qi);
						
						int action = o.getInt("action");
						JSONObject jo =action == 3 ? null:o.getJSONObject("object");
						int srvVcsCommitId = o.getInt("commit_id");
						int srvCommitUserId = o.getInt("user_id");
						int tableId = o.getInt("table_id");
						int tablePk = o.getInt("table_pk");

						dao.saveVcsObject(scd, tableId, tablePk, action, jo);
						W5VcsObject vo = voMap.get(tableId + "." + tablePk);
						vo.setVcsObjectStatusTip((short)9);
						vo.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, tableId, tablePk));
						
						if(vo.getVcsObjectId()==0){
							vo.setVcsCommitId(srvVcsCommitId);
							vo.setInsertUserId(srvCommitUserId);
							dao.saveObject(vo);
						} else {
							vo.setVersionNo((short)(vo.getVersionNo()+1));
							vo.setVersionUserId(srvCommitUserId);
							vo.setVcsCommitId(srvVcsCommitId);
							dao.updateObject(vo);
						}
						
					}catch (Exception e){
						if(!continueOnFail)throw new IWBException("vcs","vcsClientObjectPullMulti::oops", 0, s, e.getMessage(), e.getCause());
					}
				}
					
			} catch (IWBException e){
				throw e;
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectPullMulti:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		return result;
	}
	

	public Map vcsServerObjectPullMulti(String userName, String passWord, int customizationId, String projectId, String tableKeys, boolean continueOnFail, String clientIP) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPullMulti",0,null, "Not a VCS Server to vcsServerObjectPullMulti", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPullMulti", 0, projectId, "No VCS for this Project2", null);
		}
		
		Map result = new HashMap();
		result.put("success", true);
		List data = new ArrayList();
		String[] arTableKeys = tableKeys.split(",");
		for(String k:arTableKeys){
			String[] tableKey = k.replace('.', ',').split(",");
			int tableId=GenericUtil.uInt(tableKey[0]);
			W5Table t = FrameworkCache.getTable(customizationId, tableId);
			if(t.getVcsFlag()==0){
				if(continueOnFail)continue;
				else throw new IWBException("vcs","vcsServerObjectPullMulti", t.getTableId(), "Not VCS Table", "Not VCS Table2", null);
			}
			int vcsCommitId = tableKey.length>2 ? GenericUtil.uInt(tableKey[2]) : 0;
		//	List<W5VcsCommit> lc = dao.find("from W5VcsCommit t where t.vcsCommitId>? order by t.vcsCommitId", vcsCommitId);

			
			Map m = new HashMap();
				
			int tablePk=GenericUtil.uInt(tableKey[1]);
			List l = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", 
					tableId, tablePk, customizationId, projectId);
			if(GenericUtil.isEmpty(l))
				throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "Not VCS Object2", null);
	
			W5VcsObject o = (W5VcsObject)l.get(0);
			if(false && o.getVcsCommitId()<=vcsCommitId){ //TODO
				if(continueOnFail)continue;
				else throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "No Update for Specified Object2", null);
			}
			m.put("commit_id", o.getVcsCommitId());
			m.put("user_id", o.getVersionUserId());
			m.put("table_id", tableId);
			m.put("table_pk", tablePk);
			if(o.getVcsObjectStatusTip()==8)m.put("action", 3);
			else {
				StringBuilder s = new StringBuilder();
				s.append("select x.* from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
				if(t.get_tableParamList().size()>1)s.append(" AND x.customization_id=").append(customizationId);
				List p= new ArrayList();p.add(tablePk);
				Map mo =(Map)dao.executeSQLQuery2Map(s.toString(), p).get(0);
				
				m.put("object", mo);
				m.put("action", vcsCommitId==0 ? 2:1);
			}
		
		/*	List sqls = new ArrayList();
			for(W5VcsCommit vc:lc)if(!GenericUtil.isEmpty(vc.getExtraSql())){
				Map m2 = new HashMap();
				m2.put("commitId", vc.getVcsCommitId());
				m2.put("sql", vc.getExtraSql());
				sqls.add(m2);
			}
			if(!GenericUtil.isEmpty(sqls))
				m.put("sqls", sqls); */
			data.add(m);
			
		}
		result.put("data", data);
		dao.saveObject(new Log5VcsAction(scd, (short) 14,clientIP));

		return result;
	}
	
	public Map vcsServerObjectPullMultiOld(String userName, String passWord, int customizationId, String projectId, String tableKeys) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPullMulti",0,null, "Not a VCS Server to vcsServerObjectPullMulti", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPullMulti", 0, projectId, "No VCS for this Project2", null);
		}
		
		Map result = new HashMap();
		result.put("success", true);
		List data = new ArrayList();
		String[] arTableKeys = tableKeys.split(",");
		for(String k:arTableKeys){
			String[] tableKey = k.replace('.', ',').split(",");
			int tableId=GenericUtil.uInt(tableKey[0]);
			W5Table t = FrameworkCache.getTable(customizationId, tableId);
			if(t.getVcsFlag()==0){
				throw new IWBException("vcs","vcsServerObjectPullMulti", t.getTableId(), "Not VCS Table", "Not VCS Table2", null);
			}
			int vcsCommitId = tableKey.length>2 ? GenericUtil.uInt(tableKey[2]) : 0;
			List<W5VcsCommit> lc = dao.find("from W5VcsCommit t where t.projectUuid=? AND t.vcsCommitId>? order by t.vcsCommitId", projectId, vcsCommitId);
			if(false && GenericUtil.isEmpty(lc)){ //TODO
				throw new IWBException("vcs","No Update for Specified Commit",vcsCommitId, "Not Found", "tralala", null);
			}
			
			Map m = new HashMap();
				
			int tablePk=GenericUtil.uInt(tableKey[1]);
			List l = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
					tableId, tablePk, projectId, customizationId);
			if(GenericUtil.isEmpty(l))
				throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "Not VCS Object2", null);
	
			W5VcsObject o = (W5VcsObject)l.get(0);
			if(false && o.getVcsCommitId()<=vcsCommitId) //TODO
				throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "No Update for Specified Object2", null);
			m.put("commit_id", o.getVcsCommitId());
			m.put("user_id", o.getVersionUserId());
			m.put("table_id", tableId);
			m.put("table_pk", tablePk);
			if(o.getVcsObjectStatusTip()==8)m.put("action", 3);
			else {
				StringBuilder s = new StringBuilder();
				s.append("select x.* from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
				if(t.get_tableParamList().size()>1)s.append(" AND x.customization_id=").append(customizationId);
				List p= new ArrayList();p.add(tablePk);
				Map mo =(Map)dao.executeSQLQuery2Map(s.toString(), p).get(0);
				
				m.put("object", mo);
				m.put("action", vcsCommitId==0 ? 2:1);
			}
		
			List sqls = new ArrayList();
			for(W5VcsCommit vc:lc)if(!GenericUtil.isEmpty(vc.getExtraSql())){
				Map m2 = new HashMap();
				m2.put("commitId", vc.getVcsCommitId());
				m2.put("sql", vc.getExtraSql());
				sqls.add(m2);
			}
			if(!GenericUtil.isEmpty(sqls))
				m.put("sqls", sqls);
			data.add(m);
			
		}
		result.put("data", data);
		dao.saveObject(new Log5VcsAction(scd, (short) 14,null));

		return result;
	}

	

	public Map vcsServerObjectPull(String userName, String passWord, int customizationId, String projectId, int tableId, int tablePk, int vcsCommitId) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPull",0,null, "Not a VCS Server to vcsServerObjectPull", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPull", 0, projectId, "No VCS for this Project2", null);
		}
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not VCS Table", "Not VCS Table2", null);
		}
		
		List<W5VcsCommit> lc = dao.find("from W5VcsCommit t where t.projectUuid=? AND t.vcsCommitId>? order by t.vcsCommitId", projectId, vcsCommitId);
		if(false && GenericUtil.isEmpty(lc)){ //TODO
			throw new IWBException("vcs","No Update for Specified Commit",vcsCommitId, "Not Found", "tralala", null);
		}
		
		Map m = new HashMap();
			
		List l = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
				tableId, tablePk, projectId, customizationId);
		if(GenericUtil.isEmpty(l))
			throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "Not VCS Object2", null);

		W5VcsObject o = (W5VcsObject)l.get(0);
		if(false && o.getVcsCommitId()<=vcsCommitId) //TODO
			throw new IWBException("vcs","vcsServerObjectPull", t.getTableId(), "Not Found", "No Update for Specified Object2", null);
		m.put("commit_id", o.getVcsCommitId());
		m.put("user_id", o.getVersionUserId());
		if(o.getVcsObjectStatusTip()==8)m.put("action", 3);
		else {
			StringBuilder s = new StringBuilder();
			s.append("select x.* from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
			if(t.get_tableParamList().size()>1)s.append(" AND x.customization_id=").append(customizationId);
			List p= new ArrayList();p.add(tablePk);
			Map mo =(Map)dao.executeSQLQuery2Map(s.toString(), p).get(0);
			
			m.put("object", mo);
			m.put("action", vcsCommitId==0 ? 2:1);
		}
	
		/*
		Map scd = new HashMap(); scd.put("customizationId", customizationId);scd.put("projectId", projectId);
		List<W5TableChildHelper> detailObjects = dao.findRecordChildRecords(scd, tableId, tablePk);
		if(!GenericUtil.isEmpty(detailObjects)){
			List<Map> lx = new ArrayList();
			for(W5TableChildHelper ch:detailObjects){
				W5Table dt = FrameworkCache.getTable(customizationId, ch.getTableChild().getTableId());
				if(dt.getVcsFlag()==0)continue;
				List lq = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
						dt.getTableId(), ch.get, projectId, customizationId);
				if(GenericUtil.isEmpty(lq))continue;
				
				StringBuilder s2 = new StringBuilder();
				s2.append("select x.* from ").append(dt.getDsc()).append(" x where x.").append(dt.get_tableFieldMap().get).append("=?");
				if(dt.get_tableParamList().size()>1)s2.append(" AND x.customization_id=").append(customizationId);
				List p2= new ArrayList();p2.add(tablePk);
				Map mo2 =(Map)dao.executeSQLQuery2Map(s2.toString(), p2).get(0);
				Map m2 = new HashMap();
				m2.put("tableId", dt.getTableId());
				m2.put("object", mo2);
			}
		} */
		
		List sqls = new ArrayList();
		for(W5VcsCommit vc:lc)if(!GenericUtil.isEmpty(vc.getExtraSql())){
			Map m2 = new HashMap();
			m2.put("commitId", vc.getVcsCommitId());
			m2.put("sql", vc.getExtraSql());
			sqls.add(m2);
		}
		if(!GenericUtil.isEmpty(sqls))
			m.put("sqls", sqls);
		
		dao.saveObject(new Log5VcsAction(scd, (short) 13,null));

		return m;
	}


	public W5QueryResult vcsClientObjectsAll(Map<String, Object> scd) {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectsAll", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid();
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectsAll";
		String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONObject srvTables =json.getJSONObject("list");
					List<W5VcsObject> lclObjects = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? order by t.tableId, t.tablePk", projectUuid, customizationId) ;
					Map<String, W5VcsObject> srcMap = new HashMap();
					for(W5VcsObject ox:lclObjects){
						srcMap.put(ox.getTableId()+"."+ox.getTablePk(), ox);
					}
					
					W5QueryResult qr = dao.getQueryResult(scd, 2767);
					qr.setErrorMap(new HashMap());qr.setNewQueryFields(new ArrayList(qr.getQuery().get_queryFields().size()));qr.getNewQueryFields().addAll(qr.getQuery().get_queryFields());
					List<Object[]> data = new ArrayList();
					Iterator keyz = srvTables.keys();
					W5Table t = null;
					StringBuilder sql = null;
					List summaryParams = null;
					String ssql=null;
					while(keyz.hasNext()){
						int srvTableId = GenericUtil.uInt(keyz.next());
						if(t==null || t.getTableId()!=srvTableId){
							t = FrameworkCache.getTable(customizationId, srvTableId);
							sql = new StringBuilder();
							sql.append("select (").append(t.getSummaryRecordSql()).append(") qqq from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
							if(t.get_tableParamList().size()>1)sql.append(" AND x.customization_id=").append(customizationId);
							Object[] res = DBUtil.filterExt4SQL(sql.toString(), scd, new HashMap(), new HashMap());
							summaryParams = (List)res[1];summaryParams.add(0);
							ssql=((StringBuilder)res[0]).toString();
						}
						if(t.getVcsFlag()==0)continue;
						JSONArray srvObjects = srvTables.getJSONArray(srvTableId+"");
						for(int qi=0;qi<srvObjects.length();qi++){
							JSONObject o = srvObjects.getJSONObject(qi);
							
							int srvPk = GenericUtil.uInt(o.keys().next());
							int srvCommitId = GenericUtil.uInt(o.getString(srvPk+""));
							Object[] od = new Object[8];
							String pk = t.getTableId()+"."+srvPk;
							od[0]=pk;
							od[1]=t.getTableId();//tableId
							od[2]=t.getDsc();//table Desc
							od[3]=srvPk;//server vcsCommitId
							od[4]=srvCommitId;//server vcsCommitId
							W5VcsObject lclObj = srcMap.get(pk);
							if(lclObj!=null){//server'da ve localde var
								if(srvCommitId<0){ //server'da silinmis, localde hala var
									if(lclObj.getVcsObjectStatusTip()==8){ //localde de silinmis, atla
										srcMap.remove(pk);
										continue;
									}
									//od[1]=0;//server vcsCommitId (-,+)
									od[5]=lclObj.getVcsCommitId();//local vcsCommitId
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll=dao.executeSQLQuery2(ssql, summaryParams);
									if(GenericUtil.isEmpty(ll)){//boyle birsey olmamasi lazim normalde ama varsa, duzeltmek lazim
										lclObj.setVcsObjectStatusTip((short)8);
										dao.updateObject(lclObj);
										srcMap.remove(pk);
										continue;
									}
									od[6]=ll.get(0);//recordSummary
									od[7]=lclObj.getVcsObjectStatusTip()==1 ? 3:1;//edit edildiyse, conflict, aksi halde pull(delete)				
								} else if(lclObj.getVcsObjectStatusTip()==3){ //localde silinmis, server'da var
//									od[1]=srvCommitId;//server vcsCommitId (+,-)
									od[5]=-lclObj.getVcsCommitId();//local vcsCommitId
									od[6]=lclObj.getVcsCommitRecordHash();//recordSummary: cheat
									od[7]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
									
								} else if(lclObj.getVcsObjectStatusTip()==1){ //localde edit edilmis
									od[4]=-srvCommitId;
									od[5]=-lclObj.getVcsCommitId();//local vcsCommitId(-,-)
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll = dao.executeSQLQuery2(ssql, summaryParams);
									if(GenericUtil.isEmpty(ll)){//local'de boyle gercek kayit yok::NEW
										srcMap.remove(pk);
										continue;
									}
									od[6]=ll.get(0);//recordSummary
									od[7]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
								} else if(lclObj.getVcsObjectStatusTip()==9){ //localde synched, serverda edit edilmis
									if(srvCommitId==lclObj.getVcsCommitId()){
										srcMap.remove(pk);
										continue; //normalde olmasi lazim
									}
//									od[4]=srvCommitId;//karsi taraf degismis(+,+)
									od[5]=lclObj.getVcsCommitId();//local vcsCommitId: karsi tarfta yeniyse NULL
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll = dao.executeSQLQuery2(ssql, summaryParams);
									od[6]=GenericUtil.isEmpty(ll) ? "Record Not Found!!" : ll.get(0);//recordSummary
									od[7]=1;//pull				
								} else {
									od[6]="Error: Probably ID Conflicts";//recordSummary
									od[7]=3;//conflict	
								}
							} else { //server'da var, localde yok
								if(srvCommitId<0){ //localde hic yokmus, atla
									srcMap.remove(pk);
									continue;
								}
								od[5]=0;//local vcsCommitId: burda karsiligi yok, eklenmesi lazim (+,0)
								od[7]=1;//pull				
							}
							data.add(od);
							srcMap.remove(pk);
						}

					}
					if(!srcMap.isEmpty())for(String k:srcMap.keySet()){ //localde yeni eklenmis, server'da yok TODO
						Object[] od = new Object[8];
						od[0]=k;
						String[] kx = k.replace('.', ',').split(",");
						int tableId = GenericUtil.uInt(kx[0]);
						od[1]=tableId;
						od[2]=FrameworkCache.getTable(customizationId, tableId).getDsc();
						od[3]=GenericUtil.uInt(kx[1]);
						od[4]=0;//server vcsCommitId (0,+)
						od[5]=srcMap.get(k).getVcsCommitId();//local vcsCommitId
						//summaryParams.set(summaryParams.size()-1, k);
						od[6]=dao.getTableRecordSummary(scd, tableId, (Integer)od[3], 0);
						od[7]=2;//push
						data.add(od);
						
					}
					qr.setData(data);
					qr.setFetchRowCount(data.size());
					qr.setResultRowCount(data.size());
//					convertFromStraight2Tree(po, qr);

					return qr;
				} else
					throw new IWBException("vcs","vcsClientObjectsAll:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectsAll:JSONException", 0, url, e.getMessage(), e.getCause());
				
			}
		}
		throw new IWBException("vcs","vcsClientObjectsAll", 0, url, "No Response from VCS Server2", null);
		
	}
	
	public W5QueryResult vcsClientObjectsAllTree(Map<String, Object> scd, String schema, int userId, String dtStart, String dtEnd) {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectsAll", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid();
		if(!GenericUtil.isEmpty(schema))urlParameters+="&s="+schema;
		if(userId>0)urlParameters+="&_u="+userId;
		if(!GenericUtil.isEmpty(dtStart) && dtStart.length()==10)urlParameters+="&_ds="+dtStart;
		if(!GenericUtil.isEmpty(dtEnd) && dtEnd.length()==10)urlParameters+="&_de="+dtEnd;
		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectsAll";
		String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONObject srvTables =json.getJSONObject("list");
					List<W5VcsObject> lclObjects = null;
					if(GenericUtil.isEmpty(schema)){
						lclObjects = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? order by t.tableId, t.tablePk", projectUuid, customizationId) ;
					} else {
						if(!schema.endsWith("%"))schema+="%";
						lclObjects = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? and exists(select 1 from W5Table q where q.customizationId=t.customizationId AND q.tableId=t.tableId AND q.dsc like ?) order by t.tableId, t.tablePk", projectUuid, customizationId,schema) ;
					}
					Map<String, W5VcsObject> srcMap = new HashMap();
					for(W5VcsObject ox:lclObjects){
						srcMap.put(ox.getTableId()+"."+ox.getTablePk(), ox);
					}
					
					W5QueryResult qr = dao.getQueryResult(scd, 148);
					qr.setErrorMap(new HashMap());qr.setNewQueryFields(new ArrayList(qr.getQuery().get_queryFields().size()));qr.getNewQueryFields().addAll(qr.getQuery().get_queryFields());
					List<Object[]> data = new ArrayList();
					Iterator keyz = srvTables.keys();
					W5Table t = null;
					StringBuilder sql = null;
					List summaryParams = null;
					String ssql=null;
					while(keyz.hasNext()){
						int srvTableId = GenericUtil.uInt(keyz.next());
						if(t==null || t.getTableId()!=srvTableId){
							t = FrameworkCache.getTable(customizationId, srvTableId);
							if(t==null)continue;
							sql = new StringBuilder();
							sql.append("select (").append(t.getSummaryRecordSql()).append(") qqq from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
							if(t.get_tableParamList().size()>1)sql.append(" AND x.customization_id=").append(customizationId);
							Object[] res = DBUtil.filterExt4SQL(sql.toString(), scd, new HashMap(), new HashMap());
							summaryParams = (List)res[1];summaryParams.add(0);
							ssql=((StringBuilder)res[0]).toString();
						}
						if(t.getVcsFlag()==0)continue;
						JSONArray srvObjects = srvTables.getJSONArray(srvTableId+"");
						for(int qi=0;qi<srvObjects.length();qi++){
							JSONObject o = srvObjects.getJSONObject(qi);
							
							int srvPk = GenericUtil.uInt(o.keys().next());
							int srvCommitId = o.getInt(srvPk+"");
							Object[] od = new Object[14];
							String pk = t.getTableId()+"."+srvPk;
							od[0]=pk;
							od[1]=t.getTableId();//tableId
							od[2]=t.getDsc();//table Desc
							od[3]=srvPk;//server vcsCommitId
							od[4]=srvCommitId;//server vcsCommitId
							W5VcsObject lclObj = srcMap.get(pk);
							if(lclObj!=null){//server'da ve localde var
								if(srvCommitId<0){ //server'da silinmis, localde hala var
									if(lclObj.getVcsObjectStatusTip()==8){ //localde de silinmis, atla
										srcMap.remove(pk);
										continue;
									}
									//od[1]=0;//server vcsCommitId (-,+)
									od[5]=lclObj.getVcsCommitId();//local vcsCommitId
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll=dao.executeSQLQuery2(ssql, summaryParams);
									if(GenericUtil.isEmpty(ll)){//boyle birsey olmamasi lazim normalde ama varsa, duzeltmek lazim
										lclObj.setVcsObjectStatusTip((short)8);
										dao.updateObject(lclObj);
										srcMap.remove(pk);
										continue;
									}
									od[6]=ll.get(0);//recordSummary
									od[7]=lclObj.getVcsObjectStatusTip()==1 ? 3:1;//edit edildiyse, conflict, aksi halde pull(delete)				
								} else if(lclObj.getVcsObjectStatusTip()==3){ //localde silinmis, server'da var
//									od[1]=srvCommitId;//server vcsCommitId (+,-)
									od[5]=-lclObj.getVcsCommitId();//local vcsCommitId
									od[6]=lclObj.getVcsCommitRecordHash();//recordSummary: cheat
									od[7]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
									
								} else if(lclObj.getVcsObjectStatusTip()==1){ //localde edit edilmis
									od[4]=-srvCommitId;
									od[5]=-lclObj.getVcsCommitId();//local vcsCommitId(-,-)
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll = dao.executeSQLQuery2(ssql, summaryParams);
									od[6]=GenericUtil.isEmpty(ll) ? "Record Not Found!!" : ll.get(0);//recordSummary
									od[7]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
								} else if(lclObj.getVcsObjectStatusTip()==9){ //localde synched, serverda edit edilmis
									if(srvCommitId==lclObj.getVcsCommitId()){
										srcMap.remove(pk);
										continue; //normalde olmasi lazim
									}
//									od[4]=srvCommitId;//karsi taraf degismis(+,+)
									od[5]=lclObj.getVcsCommitId();//local vcsCommitId: karsi tarfta yeniyse NULL
									summaryParams.set(summaryParams.size()-1, srvPk);
									List ll = dao.executeSQLQuery2(ssql, summaryParams);
									od[6]=GenericUtil.isEmpty(ll) ? "Record Not Found!!" : ll.get(0);//recordSummary
									od[7]=1;//pull				
								} else {
									od[6]="Error: Probably ID Conflicts";//recordSummary
									od[7]=3;//conflict	
								}
							} else { //server'da var, localde yok
								if(srvCommitId<0){ //localde hic yokmus, atla
									srcMap.remove(pk);
									continue;
								}
								od[5]=0;//local vcsCommitId: burda karsiligi yok, eklenmesi lazim (+,0)
								od[7]=1;//pull				
							}
							
							data.add(od);
							srcMap.remove(pk);
						}

					}
					if(!srcMap.isEmpty())for(String k:srcMap.keySet())if(srcMap.get(k).getVcsObjectStatusTip()!=8){ //localde yeni eklenmis, server'da yok TODO
						Object[] od = new Object[14];
						od[0]=k;
						String[] kx = k.replace('.', ',').split(",");
						int tableId = GenericUtil.uInt(kx[0]);
						od[1]=tableId;
						W5Table tx = FrameworkCache.getTable(customizationId, tableId); 
						od[2]=tx!=null?tx.getDsc():"Table Not Found";
						od[3]=GenericUtil.uInt(kx[1]);
						od[4]=0;//server vcsCommitId (0,+)
						od[5]=srcMap.get(k).getVcsCommitId();//local vcsCommitId
						//summaryParams.set(summaryParams.size()-1, k);
						od[6]=tx!=null?dao.getTableRecordSummary(scd, tableId, (Integer)od[3], 0):"";
						od[7]=2;//push
						data.add(od);
						
					}
					qr.setData(data);
					qr.setFetchRowCount(data.size());
					qr.setResultRowCount(data.size());
					
					
					return convertFromStraight2Tree(po, qr, userId, dtStart, dtEnd);
//					return qr;
				} else
					throw new IWBException("vcs","vcsClientObjectsAll:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectsAll:JSONException", 0, url, e.getMessage(), e.getCause());
				
			}
		}
		throw new IWBException("vcs","vcsClientObjectsAll", 0, url, "No Response from VCS Server2", null);
		
	}

	
	private W5QueryResult convertFromStraight2Tree(W5Project po, W5QueryResult qr, int userId, String dtStart, String dtEnd) {
		JSONArray ar = new JSONArray();
		Map<String, List> pm = new HashMap<String, List>();
		Map<String, Object[]> wpm = new HashMap<String, Object[]>();
		List<Object[]> data2 = null;
		if(userId>0 || (!GenericUtil.isEmpty(dtStart) && dtStart.length()==10) || (!GenericUtil.isEmpty(dtEnd) && dtEnd.length()==10)){
			data2 = new ArrayList();
		}
		for(Object[] od:qr.getData()){
			wpm.put(od[0].toString(), od);
			int tableId = (Integer)od[1];
			W5Table t = FrameworkCache.getTable(0, tableId);
			od[8]=od[0];
			od[10]=1;
			if(t!=null && t.getTableTip()!=0 && !GenericUtil.isEmpty(t.get_tableParentList())){ // detail ise
				List<W5TableRecordHelper> pr = dao.findRecordParentRecords(qr.getScd(), tableId, GenericUtil.uInt(od[3]), 2, false);
//				if(tableId==64){
//					tableId = 8*8;
//				}
				if(!GenericUtil.isEmpty(pr) && pr.size()>1){
					W5TableRecordHelper th = pr.get(1);
					String key = th.getTableId() + "." + th.getTablePk();
					od[9]=key;
					od[10]=1;
					List l = pm.get(key);
					if(l==null){
						pm.put(key, l = new ArrayList());
					}
					l.add(od);					
				}
			} else{ 
				od[10]=1;
			}
			if((Integer)od[7]==1 || (Integer)od[7]==3){ //pull ve conflict ise, gerekli bilgiyi karsidan cek
				ar.put(tableId+"."+od[3]);
			}
		}
		
		if(ar.length()>0)try {
			JSONObject params = new JSONObject(); 
			params.put("u", po.getVcsUserName());
			params.put("p", po.getVcsPassword());params.put("c", 0);params.put("r", po.getProjectUuid());
			params.put("objects", ar);
			if(userId>0)params.put("_u", userId);
			Date startDt = null, endDt = null;
			if(!GenericUtil.isEmpty(dtStart) && dtStart.length()==10)try{
				startDt = GenericUtil.uDate(dtStart);
				if(startDt!=null)params.put("_ds", dtStart);
			} catch(Exception ee){}
			if(!GenericUtil.isEmpty(dtEnd) && dtEnd.length()==10)try{
				endDt = GenericUtil.uDate(dtEnd);
				if(endDt!=null)params.put("_de", dtEnd);
			} catch(Exception ee){}
			String url=po.getVcsUrl();//"http://localhost:8080/q1/app/";//
			if(!url.endsWith("/"))url+="/";
			url+="serverVCSObjectsDetail";
			String s = HttpUtil.sendJson(url, params);
			if(!GenericUtil.isEmpty(s)){
				JSONObject json;
				try {
					json = new JSONObject(s);
					if(json.get("success").toString().equals("true")){
						JSONArray data = json.getJSONArray("data");
						for(int qi=0;qi<data.length();qi++){
							JSONObject jo = data.getJSONObject(qi);
							String id = jo.getString("id");
//							if(id.substring(0,3).equals("64.")){
//								id = id.substring(0);
//							}
							Object[] od = wpm.get(id);
							if(od[9]==null && jo.has("parent")){ // kendisnin parent'i yoksa
								String parent = jo.getString("parent");
								od[9] = parent;
								List l = pm.get(parent);
								if(l==null){
									pm.put(parent, l = new ArrayList());
								}
								l.add(od);	
							}
							if(jo.has("dsc")){ // description
								String dsc = jo.getString("dsc");
								if((Integer)od[7]==3){//conflict
									if(!GenericUtil.safeEquals(od[6], dsc))
										od[6] = od[6] + " (Remote: " + dsc +")";
								} else od[6]=dsc;
							}
							boolean bx = false;
							if(jo.has("user_id")){ // userId
								od[11] = jo.getInt("user_id");
								if(jo.has("user_dsc"))od[12] = jo.getString("user_dsc");
								if(userId!=0 && userId==(Integer)od[11]){
									bx = true;
								}
							}
							if(jo.has("commit_dttm")){ // commitDttm
								od[13] = jo.getString("commit_dttm");
								if(startDt!=null || endDt!=null)try{
									Date dt = GenericUtil.uDate(jo.getString("commit_dttm"));
									if(startDt!=null && startDt.before(dt))bx = false;
									if(endDt!=null && startDt.after(dt))bx = false;
								} catch(Exception ee){}
							}
							if(bx)data2.add(od);
						}
					} else
						throw new IWBException("vcs","convertFromStraight2Tree:server Error Response", 0, s, json.getString("error"), null);
				} catch (JSONException e){
					throw new IWBException("vcs","convertFromStraight2Tree:JSONException", 0, s, e.getMessage(), e.getCause());
				}

			}
		} catch (Exception e) {
			if(FrameworkSetting.debug)e.printStackTrace();
		}
		
		for(Object[] od:qr.getData()){
			int tableId = (Integer)od[1];
//			W5Table t = FrameworkCache.getTable(0, tableId);
			if(pm.containsKey(od[0].toString())){ // master ve altinda eleman var ise
				od[10]=0;
				od[2]="("+pm.get(od[0].toString()).size()+") " +  od[2];
				pm.remove(od[0].toString());
			}
		}
		
		if(data2!=null)qr.setData(data2);
		for(String key:pm.keySet()){
			String[] k = key.replace('.', ',').split(",");
			int tableId = GenericUtil.uInt(k[0]);
			W5Table t = FrameworkCache.getTable(0, tableId);
			if(t==null){
				continue;
			}
			List<W5TableRecordHelper> pr = dao.findRecordParentRecords(qr.getScd(), tableId, GenericUtil.uInt(k[1]), 1, false);
			if(!GenericUtil.isEmpty(pr)){
				Object[] od = new Object[14]; 
				od[0]=key;
				od[8]=key;
				od[1]=t.getTableId();//table Desc
				od[2]="("+pm.get(key).size()+") " +  t.getDsc();//table Desc
				od[6]=pr.get(0).getRecordDsc();//server vcsCommitId
				od[7]=0;//server vcsCommitId
				od[10]=0;
				qr.getData().add(od);
			} else {
				Object[] od = new Object[14]; 
				od[0]=key;
				od[1]=t.getTableId();//table Desc
				od[8]=key;
				od[2]="("+pm.get(key).size()+") " +  t.getDsc();//table Desc
				od[6]="(parent not found)";//server vcsCommitId
				od[7]=0;//server vcsCommitId
				od[10]=0;
				qr.getData().add(od);
			}
		}

		return qr;
	}
	
	public boolean vcsClientMove2AnotherProject(Map<String, Object> scd, String newProjectUiid, int tableId, int tablePk) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientMove2AnotherProject",0,null, "VCS Server not allowed to vcsClientMove2AnotherProject", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		if(projectUuid.equals(newProjectUiid))return false;
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientMove2AnotherProject", 0, projectUuid, "No VCS for this Project2", null);
		}
		W5Project npo = FrameworkCache.wProjects.get(newProjectUiid);

		if(npo.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientMove2AnotherProject", 0, projectUuid, "No VCS for this Project3", null);
		}
		W5Table mt = FrameworkCache.getTable(customizationId, tableId);
		
		
		StringBuilder sql = new StringBuilder();List<Object> params = new ArrayList();

		//master check
		sql.append("select v.vcs_object_status_tip from iwb.w5_vcs_object v where v.customization_id=? AND v.table_id=? AND v.table_pk=? AND exists(select 1 from ").append(mt.getDsc())
		.append(" m where m.project_uuid=? AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
		params.add(customizationId);params.add(tableId);params.add(tablePk);params.add(projectUuid);
		if(mt.get_tableParamList().size()>1){
			sql.append(" AND m.customization_id=?");
			params.add(customizationId);
		}
		sql.append(")");
		List lr = dao.executeSQLQuery2(sql.toString(), params);
		if(GenericUtil.isEmpty(lr))return false;
		boolean masterInsert = GenericUtil.uInt(lr.get(0))==2;
	
	
		if(masterInsert){
			sql.setLength(0);params.clear();
			sql.append("update ").append(mt.getDsc()).append(" m set project_uuid=? where exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=m.")
			.append(mt.get_tableParamList().get(0).getExpressionDsc()).append(") AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
			params.add(newProjectUiid);params.add(customizationId);params.add(tableId);params.add(tablePk);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
			dao.executeUpdateSQLQuery(sql.toString(), params);
			
			sql.setLength(0);params.clear();
			sql.append("update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.table_id=? AND v.table_pk=? AND v.vcs_object_status_tip=2 AND exists(select 1 from ").append(mt.getDsc())
				.append(" m where m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
			params.add(newProjectUiid);params.add(customizationId);params.add(tableId);params.add(tablePk);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
			sql.append(")");
			dao.executeUpdateSQLQuery(sql.toString(), params);
		}
		
		if(!GenericUtil.isEmpty(mt.get_tableChildList()))for(W5TableChild tc:mt.get_tableChildList()){
			W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
			if(dt.getTableTip()==0)continue;
			sql.setLength(0);params.clear();
			
			sql.append("update ").append(dt.getDsc()).append(" d set project_uuid=? where exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
				.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
				.append(" m where m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc())
				.append(" AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
			params.add(newProjectUiid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(tablePk);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
			sql.append(")");
			if(tc.getRelatedStaticTableFieldId()!=0){
				sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
				
			}
			if(dt.get_tableParamList().size()>1){
				sql.append(" AND d.customization_id=?");
				params.add(customizationId);
			}
			
//			List rl = dao.executeSQLQuery2("select "+tc.getRelatedTableId()+" tid, "+dt.get_tableParamList().get(0).getExpressionDsc()+" tpk from "+dt.getDsc()+" d " + sql.toString(), params);
			dao.executeUpdateSQLQuery(sql.toString(), params);

			sql.setLength(0);params.clear();
			sql.append("update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.table_id=? AND v.vcs_object_status_tip=2 AND exists(select 1 from ").append(dt.getDsc())
				.append(" d, ").append(mt.getDsc()).append(" m where d.").append(dt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc())
				.append(" AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
			if(tc.getRelatedStaticTableFieldId()!=0){
				sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
			}
			params.add(newProjectUiid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(tablePk);
			if(dt.get_tableParamList().size()>1){
				sql.append(" AND d.customization_id=?");
				params.add(customizationId);
			}
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
			sql.append(")");
			dao.executeUpdateSQLQuery(sql.toString(), params);
		}

		if(!masterInsert){
			sql.setLength(0);params.clear();
			sql.append("update ").append(mt.getDsc()).append(" m set project_uuid=? where m.project_uuid=? AND exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip in (1,9) AND v.customization_id=? AND v.table_id=? AND v.table_pk=m.")
			.append(mt.get_tableParamList().get(0).getExpressionDsc()).append(") AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
			params.add(newProjectUiid);params.add(projectUuid);params.add(customizationId);params.add(tableId);params.add(tablePk);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
	//		dao.executeUpdateSQLQuery(sql.toString(), params);
			sql.append(";\nupdate iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.table_id=? AND v.table_pk=? AND v.vcs_object_status_tip in (1,9) AND exists(select 1 from ").append(mt.getDsc())
				.append(" m where m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
			params.add(newProjectUiid);params.add(customizationId);params.add(tableId);params.add(tablePk);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND m.customization_id=?");
				params.add(customizationId);
			}
			sql.append(");");
			
			if(!GenericUtil.isEmpty(mt.get_tableChildList()))for(W5TableChild tc:mt.get_tableChildList()){
				W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
				if(dt.getTableTip()==0)continue;
				
				sql.append("\n update ").append(dt.getDsc()).append(" d set project_uuid=? where exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip in (1,9) AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
					.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
					.append(" m where m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc())
					.append(" AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
				params.add(newProjectUiid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(tablePk);
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND m.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				if(tc.getRelatedStaticTableFieldId()!=0){
					sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
					
				}
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
				
		//		List rl = dao.executeSQLQuery2("select "+tc.getRelatedTableId()+" tid, "+dt.get_tableParamList().get(0).getExpressionDsc()+" tpk from "+dt.getDsc()+" d " + sql.toString(), params);
				sql.append(";\n update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.table_id=? AND v.vcs_object_status_tip in (1,9) AND exists(select 1 from ").append(dt.getDsc())
					.append(" d, ").append(mt.getDsc()).append(" m where d.").append(dt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc())
					.append(" AND m.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=?");
				if(tc.getRelatedStaticTableFieldId()!=0){
					sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
				}
				params.add(newProjectUiid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(tablePk);
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND m.customization_id=?");
					params.add(customizationId);
				}
				sql.append(");");
			}
			
			dao.executeUpdateSQLQuery(sql.toString(), params);
			vcsClientPushSqlRT(scd, GenericUtil.replaceSql(sql.toString(), params), mt.getDsc() + " move to another project (" + newProjectUiid);
		}

		
		return true;
	}
	
	public W5QueryResult vcsClientXRay(Map<String, Object> scd) {
//		if(FrameworkSetting.vcsServer)throw new PromisException("vcs","vcsClientReorg",0,null, "VCS Server not allowed to vcsClientReorg", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientXRay", 0, projectUuid, "No VCS for this Project2", null);
		}
		W5QueryResult qr = dao.getQueryResult(scd, 161);
		qr.setErrorMap(new HashMap());qr.setNewQueryFields(new ArrayList(qr.getQuery().get_queryFields().size()));qr.getNewQueryFields().addAll(qr.getQuery().get_queryFields());
		List<Object[]> data = new ArrayList();qr.setData(data);
		int id = 0;
		List<Integer> ps = dao.executeSQLQuery("select q.table_id from iwb.w5_table q where q.customization_id=? AND q.vcs_flag=1 AND q.project_uuid in ('067e6162-3b6f-4ae2-a221-2470b63dff00',?) order by q.table_id", customizationId, projectUuid); //sadece master tablolar
		if(ps!=null)for(Integer tid:ps){
			W5Table mt = FrameworkCache.getTable(customizationId, tid);
			if(mt!=null){
				List params = new ArrayList();
				StringBuilder sql = new StringBuilder();
				sql.append("select count(1) from iwb.w5_vcs_object v where v.project_uuid=? AND v.customization_id=? AND v.table_id=? AND v.vcs_object_status_tip in (1,2,9) AND not exists(select 1 from  ").append(mt.getDsc()).append(" m where m.project_uuid=? AND m.customization_id=? AND v.table_pk=m.")
					.append(mt.get_tableParamList().get(0).getExpressionDsc()).append(")");
				params.add(projectUuid);params.add(customizationId);params.add(tid);params.add(projectUuid);params.add(customizationId);
				int cnt = GenericUtil.uInt(dao.executeSQLQuery2(sql.toString(), params).get(0));
				
				if(cnt>0){
					Object[] o= new Object[5];
					o[0] = ++id;
					o[1] = tid;
					o[2] = mt.getDsc();
					o[3] = cnt;
					o[4] = 1;
					data.add(o);
				}
			}
			
		}
		
		if(ps!=null)for(Integer tid:ps){
			W5Table mt = FrameworkCache.getTable(customizationId, tid);
			List params = new ArrayList();
			StringBuilder sql = new StringBuilder();
			sql.append("select count(1) from ").append(mt.getDsc())
				.append(" m where m.project_uuid=? AND exists(select 1 from iwb.w5_vcs_object v where v.project_uuid!=? AND v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=m.")
				.append(mt.get_tableParamList().get(0).getExpressionDsc()).append(")");
			params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tid);
		
			int cnt = GenericUtil.uInt(dao.executeSQLQuery2(sql.toString(), params).get(0));
			
			if(cnt>0){
				Object[] o= new Object[5];
				o[0] = ++id;
				o[1] = tid;
				o[2] = mt.getDsc();
				o[3] = cnt;
				o[4] = 2;
				data.add(o);
			}
			
		}
		
		if(ps!=null)for(Integer tid:ps){
			W5Table mt = FrameworkCache.getTable(customizationId, tid);
			List params = new ArrayList();
			StringBuilder sql = new StringBuilder();
			sql.append("select count(1) from ").append(mt.getDsc())
				.append(" m where m.project_uuid=? AND exists(select 1 from iwb.w5_vcs_object v where v.project_uuid!=? AND v.vcs_object_status_tip in (1,9) AND v.customization_id=? AND v.table_id=? AND v.table_pk=m.")
				.append(mt.get_tableParamList().get(0).getExpressionDsc()).append(")");
			params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tid);
		
			int cnt = GenericUtil.uInt(dao.executeSQLQuery2(sql.toString(), params).get(0));
			
			if(cnt>0){
				Object[] o= new Object[5];
				o[0] = ++id;
				o[1] = tid;
				o[2] = mt.getDsc();
				o[3] = cnt;
				o[4] = 3;
				data.add(o);
			}
			
		}
		
		if(ps!=null)for(Integer tid:ps){
			W5Table mt = FrameworkCache.getTable(customizationId, tid);
			if(mt.getTableTip()!=0)continue;
			if(!GenericUtil.isEmpty(mt.get_tableChildList()))for(W5TableChild tc:mt.get_tableChildList()){
				W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
				if(dt==null || dt.getTableTip()==0)continue;
	
				List params = new ArrayList();
				StringBuilder sql = new StringBuilder();
				sql.append("where d.project_uuid!=? AND exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
					.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
					.append(" m where m.project_uuid=? AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc());
				params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND m.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				if(tc.getRelatedStaticTableFieldId()!=0){
					sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
					
				}
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
			
				int cnt = GenericUtil.uInt(dao.executeSQLQuery2("select count(1) from "+dt.getDsc()+" d " + sql.toString(), params).get(0));
				
				if(cnt>0){
					Object[] o= new Object[5];
					o[0] = ++id;
					o[1] = tid;
					o[2] = mt.getDsc() + " -> " + dt.getDsc();
					o[3] = cnt;
					o[4] = 4;
					data.add(o);
				}
			}
			
		}

		if(ps!=null)for(Integer tid:ps){
			W5Table mt = FrameworkCache.getTable(customizationId, tid);
			if(mt.getTableTip()!=0)continue;
			if(!GenericUtil.isEmpty(mt.get_tableChildList()))for(W5TableChild tc:mt.get_tableChildList()){
				W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
				if(dt==null || dt.getTableTip()==0)continue;
	
				List params = new ArrayList();
				StringBuilder sql = new StringBuilder();
				sql.append("where d.project_uuid!=? AND exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip in (1,9) AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
					.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
					.append(" m where m.project_uuid=? AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc());
				params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND m.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				if(tc.getRelatedStaticTableFieldId()!=0){
					sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
					
				}
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
			
				int cnt = GenericUtil.uInt(dao.executeSQLQuery2("select count(1) from "+dt.getDsc()+" d " + sql.toString(), params).get(0));
				
				if(cnt>0){
					Object[] o= new Object[5];
					o[0] = ++id;
					o[1] = tid;
					o[2] = mt.getDsc() + " -> " + dt.getDsc();
					o[3] = cnt;
					o[4] = 5;
					data.add(o);
				}
			}
			
		}

		return qr;
	}

	public W5QueryResult vcsClientObjectsList(Map<String, Object> scd, int tableId, int tableMasterId, int tableMasterPk) {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectsList", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectsList", t.getTableId(), t.getDsc(), "Not VCS Table2", null);
		}
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&t="+tableId+"&r="+po.getProjectUuid();
		if(tableMasterId>0)urlParameters+="&m="+tableMasterId+"&k="+tableMasterPk;
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		JSONArray ar = new JSONArray();
		url+="serverVCSObjectsList";
		String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONArray srvObjects =json.getJSONArray("list");
					List<W5VcsObject> lclObjects = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? AND t.tableId=? order by t.tablePk", projectUuid, customizationId, tableId) ;
					Map<Integer, W5VcsObject> srcMap = new HashMap();
					for(W5VcsObject ox:lclObjects){
						srcMap.put(ox.getTablePk(), ox);
					}
					StringBuilder sql = new StringBuilder();
					sql.append("select (").append(t.getSummaryRecordSql()).append(") qqq from ").append(t.getDsc()).append(" x where x.").append(t.get_tableParamList().get(0).getExpressionDsc()).append("=?");
					if(t.get_tableParamList().size()>1)sql.append(" AND x.customization_id=").append(customizationId);
					Object[] res = DBUtil.filterExt4SQL(sql.toString(), scd, new HashMap(), new HashMap());
					List summaryParams = (List)res[1];summaryParams.add(0);
					String ssql=((StringBuilder)res[0]).toString();
					
					W5QueryResult qr = dao.getQueryResult(scd, 2766);
					qr.setErrorMap(new HashMap());qr.setNewQueryFields(new ArrayList(qr.getQuery().get_queryFields().size()));qr.getNewQueryFields().addAll(qr.getQuery().get_queryFields());
					List<Object[]> data = new ArrayList();
					for(int qi=0;qi<srvObjects.length();qi++){
						JSONObject o = srvObjects.getJSONObject(qi);
						int srvPk = GenericUtil.uInt(o.keys().next());
						int srvCommitId = GenericUtil.uInt(o.get(srvPk+""));
						Object[] od = new Object[8];
						od[0]=srvPk;
						od[1]=srvCommitId;//server vcsCommitId
						W5VcsObject lclObj = srcMap.get(srvPk);
						if(lclObj!=null){//server'da ve localde var
							if(srvCommitId<0){ //server'da silinmis, localde hala var
								if(lclObj.getVcsObjectStatusTip()==8){ //localde de silinmis, atla
									srcMap.remove(srvPk);
									continue;
								}
								//od[1]=0;//server vcsCommitId (-,+)
								od[2]=lclObj.getVcsCommitId();//local vcsCommitId
								summaryParams.set(summaryParams.size()-1, srvPk);
								List ll=dao.executeSQLQuery2(ssql, summaryParams);
								if(GenericUtil.isEmpty(ll)){//boyle birsey olmamasi lazim normalde ama varsa, duzeltmek lazim
									lclObj.setVcsObjectStatusTip((short)8);
									dao.updateObject(lclObj);
									srcMap.remove(srvPk);
									continue;
								}
								od[3]=ll.get(0);//recordSummary
								od[4]=lclObj.getVcsObjectStatusTip()==1 ? 3:1;//edit edildiyse, conflict, aksi halde pull(delete)				
							} else if(lclObj.getVcsObjectStatusTip()==3){ //localde silinmis, server'da var
//								od[1]=srvCommitId;//server vcsCommitId (+,-)
								od[2]=-lclObj.getVcsCommitId();//local vcsCommitId
								od[3]=lclObj.getVcsCommitRecordHash();//recordSummary: cheat
								od[4]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
								
							} else if(lclObj.getVcsObjectStatusTip()==1){ //localde edit edilmis
								od[1]=-srvCommitId;
								od[2]=-lclObj.getVcsCommitId();//local vcsCommitId(-,-)
								summaryParams.set(summaryParams.size()-1, srvPk);
								od[3]=dao.executeSQLQuery2(ssql, summaryParams).get(0);//recordSummary
								od[4]=lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
							} else if(lclObj.getVcsObjectStatusTip()==9){ //localde synched, serverda edit edilmis
								if(srvCommitId==lclObj.getVcsCommitId()){
									srcMap.remove(srvPk);
									continue; //normalde olmasi lazim
								}
//								od[1]=srvCommitId;//karsi taraf degismis(+,+)
								od[2]=lclObj.getVcsCommitId();//local vcsCommitId: karsi tarfta yeniyse NULL
								summaryParams.set(summaryParams.size()-1, srvPk);
								od[3]=dao.executeSQLQuery2(ssql, summaryParams).get(0);//recordSummary
								od[4]=1;//pull				
							} else {
								od[3]="Error: Probably ID Conflicts";//recordSummary
								od[4]=3;//conflict	
							}
						} else { //server'da var, localde yok
							if(srvCommitId<0){ //localde hic yokmus, atla
								srcMap.remove(srvPk);
								continue;
							}
							od[2]=0;//local vcsCommitId: burda karsiligi yok, eklenmesi lazim (+,0)
							od[4]=1;//pull				
						}
						data.add(od);
						srcMap.remove(srvPk);
					}
					if(!srcMap.isEmpty())for(Integer k:srcMap.keySet()){ //localde yeni eklenmis, server'da yok
						Object[] od = new Object[8];
						od[0]=k;
						od[1]=0;//server vcsCommitId (0,+)
						od[2]=srcMap.get(k).getVcsCommitId();//local vcsCommitId
						summaryParams.set(summaryParams.size()-1, k);
						List tl = dao.executeSQLQuery2(ssql, summaryParams);
						if(!GenericUtil.isEmpty(tl)){
							od[3]=tl.get(0);//recordSummary
							od[4]=2;//push
							data.add(od);
						}
						
					}
					
					Map<String, Object[]> wpm = new HashMap<String, Object[]>();
					for(Object[] od:data)if((Integer)od[4]==1 || (Integer)od[4]==3){ //pull || conflict
						ar.put(tableId+"."+od[0]);
						wpm.put(tableId+"."+od[0], od);

					}

					if(ar.length()>0)try {
						JSONObject params = new JSONObject(); 
						params.put("u", po.getVcsUserName());
						params.put("p", po.getVcsPassword());params.put("c", 0);params.put("r", po.getProjectUuid());
						params.put("objects", ar);
						String url2=po.getVcsUrl();//"http://localhost:8080/q1/app/";//
						if(!url2.endsWith("/"))url2+="/";
						url2+="serverVCSObjectsDetail";
						String s2 = HttpUtil.sendJson(url2, params);
						if(!GenericUtil.isEmpty(s2)){
							JSONObject json2;
							try {
								json2 = new JSONObject(s2);
								if(json2.get("success").toString().equals("true")){
									JSONArray data2 = json2.getJSONArray("data");
									for(int qi=0;qi<data2.length();qi++){
										JSONObject jo = data2.getJSONObject(qi);
										String id = jo.get("id").toString();
//										if(id.substring(0,3).equals("64.")){
//											id = id.substring(0);
//										}
										Object[] od = wpm.get(id);
										
										if(jo.has("dsc")){ // description
											od[3] = jo.getString("dsc");
										}
										if(jo.has("user_id")){ // userId
											od[5] = jo.getInt("user_id");
											if(jo.has("user_dsc"))od[6] = jo.getString("user_dsc");
										}
										if(jo.has("commit_dttm")){ // commitDttm
											od[7] = jo.getString("commit_dttm");
										}
									}
								} else
									throw new IWBException("vcs","vcsClientObjectsList:server Error Response", 0, s, json.getString("error"), null);
							} catch (JSONException e){
								throw new IWBException("vcs","vcsClientObjectsList:JSONException", 0, s, e.getMessage(), e.getCause());
							}

						}
					} catch (JSONException e) {
						if(FrameworkSetting.debug)e.printStackTrace();
					}

					qr.setData(data);
					qr.setFetchRowCount(data.size());
					qr.setResultRowCount(data.size());
					return qr;
				} else
					throw new IWBException("vcs","vcsClientObjectsList:Server Error Response", 0, s, url, null);
					
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectsList:JSONException", 0, s, e.getMessage(), e.getCause());
				
			}
		}
		throw new IWBException("vcs","vcsClientObjectsList", 0, url, "No Response from VCS Server2", null);
	}

	

	public Map vcsServerObjectsList(String userName, String passWord, int customizationId, String projectId, int tableId) {
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, null);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectsList", 0, projectId, "No VCS for this Project2", null);
		}
		if(tableId>0){
			W5Table t = FrameworkCache.getTable(customizationId, tableId);
			if(t.getVcsFlag()==0){
				throw new IWBException("vcs","vcsServerObjectsList", t.getTableId(), t.getDsc(), "Not VCS Table2", null);
			}
		}
		List<W5VcsObject> l = tableId == 0 ?
				dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? order by t.tableId, t.tablePk", projectId, customizationId) :

					dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? AND t.tableId=? order by t.tablePk", projectId, customizationId, tableId);
		Map m = new HashMap();
		m.put("success", true);
		List<Map> l2= new ArrayList();
		for(W5VcsObject ox:l){
			Map m2 = new HashMap();
			m2.put(ox.getTablePk(), ox.getVcsObjectStatusTip()==8 ? -ox.getVcsCommitId() : ox.getVcsCommitId());
			l2.add(m2);
		}
		m.put("list", l2);
		dao.saveObject(new Log5VcsAction(scd, (short) 6,null));

		return m;		
	}


	public int vcsClientObjectPush(Map<String, Object> scd, int tableId, int tablePk, boolean force, boolean recursive) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectPush",0,null, "VCS Server not allowed to vcsClientObjectPush", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPush", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","Not VCS Table", tableId, null, "Not VCS Table2", null);
		}
		
		
		W5VcsObject vo = (W5VcsObject)dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", tableId, tablePk, customizationId, projectUuid).get(0);
		int action=0;
		switch(vo.getVcsObjectStatusTip()){
		case	9:case	8://synch durumdaysa Push'a gerek yok (9:active synched, 8:deleted synched)
			throw new IWBException("vcs","vcsClientObjectPush", tablePk, "vcsObjectStatusTip = " + vo.getVcsObjectStatusTip(), "Object Already Synched("+t.getDsc()+")", null);
		default:
			action = vo.getVcsObjectStatusTip();
		}

		
		Map o = action!=3 ? dao.getTableRecordJson(scd, t.getTableId(), vo.getTablePk(), 0) : new HashMap();

		
//		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&t="+vo.getTableId()+"&k="+vo.getTablePk()+"&r="+vo.getProjectUuid()+"&o="+vo.getVcsCommitId()+"&a="+action;
		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);params.put("t", tableId);params.put("k", tablePk);
		params.put("r", vo.getProjectUuid());params.put("o", vo.getVcsCommitId());params.put("a", action);
//		if(force)urlParameters+="&f=1";
		if(force)params.put("f", 1);
		if(action!=3){
//			urlParameters+="&object="+GenericUtil.uUrlEncode(GenericUtil.fromMapToJsonString2(o));
			params.put("object", GenericUtil.fromMapToJSONObject(o));
		}
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectPush";
		String s = HttpUtil.sendJson(url, params);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					int srvVcsCommitId =json.getInt("commit_id");
					vo.setVersionNo((short)(vo.getVersionNo()+1));
					vo.setVersionUserId((Integer)scd.get("userId"));
					vo.setVcsCommitId(srvVcsCommitId);					
					vo.setVcsObjectStatusTip((short)(vo.getVcsObjectStatusTip()==3 ? 8:9));//8:synched deleted, 9:synched updated/inserted
					vo.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, t.getTableId(), vo.getTablePk()));
					dao.updateObject(vo);
					return srvVcsCommitId;
				} else
					throw new IWBException("vcs","vcsClientObjectPush: serverVCSObjectPush response", t.getTableId(), s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectPush:JSON Exception", t.getTableId(), s, e.getMessage(), e.getCause());
			}
		}
		throw new IWBException("vcs","vcsClientObjectPush", t.getTableId(), null, "VCS Server not responded", null);
	}

	synchronized public int vcsServerObjectPush(String userName, String passWord, int customizationId, String projectId, int tableId, int tablePk, int vcsCommitId, int action, boolean force, JSONObject jo, String comment) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPush",0,null, "Not a VCS Server to vcsServerObjectPush", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPush", 0, projectId, "No VCS for this Project2", null);
		}
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPush", t.getTableId(), "Not VCS Table", "Not VCS Table2", null);
		}
		
			
		List l = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
				tableId, tablePk, projectId, customizationId);
		if(action == 1 && GenericUtil.isEmpty(l))
			throw new IWBException("vcs","vcsServerObjectPush", t.getTableId(), "Not Found", "Not VCS Object2", null);
		W5VcsObject o;
		
		if(action!=2)
			o = (W5VcsObject)l.get(0);
		else {
			o = new W5VcsObject(scd, t.getTableId(), tablePk);
		}
		if(!force && o.getVcsCommitId()>vcsCommitId) 
			throw new IWBException("vcs","vcsServerObjectPush", t.getTableId(), "Conflicts", "Conflicts for Specified Object2", null);
		
		o.setVcsObjectStatusTip((short)(action==3 ? 8:9));
		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", projectId);
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)commit.setVcsCommitId(1);
		else commit.setVcsCommitId((Integer)lm.get(0)+1);
		commit.setProjectUuid(projectId);commit.setComment(comment);
		dao.saveObject(commit);
		if(jo==null){
			jo=new JSONObject();
			o.setVcsObjectStatusTip((short)8);
		} else 
			o.setVcsObjectStatusTip((short)9);
		dao.saveVcsObject(scd, tableId, tablePk, action, jo);
		o.setVcsCommitId(commit.getVcsCommitId());
		if(o.getVcsObjectId()==0)
			dao.saveObject(o);
		else
			dao.updateObject(o);
		
		return commit.getVcsCommitId();
	}

	private	Map vcsServerAuthenticate(String userName, String passWord, int customizationId, String projectUuid){//TODO:
		List<Object[]> l = dao.executeSQLQuery("select x.user_id,(select r.user_role_id from iwb.w5_user_role r where r.customization_id=x.customization_id AND r.user_id=x.user_id AND r.role_id=0) user_role_id from iwb.w5_user x where x.customization_id=?::integer AND x.user_name=?::text AND x.pass_word=iwb.md5hash(x.user_name||?::text)", customizationId, userName, passWord);
		if(GenericUtil.isEmpty(l))
			throw new IWBException("vcs","vcsServerAuthenticate", 0, null, "NoUser or Wrong Password", null);
		Map scd = new HashMap();
		scd.put("userId", l.get(0)[0]);
		scd.put("userRoleId", l.get(0)[1]);
		scd.put("roleId", 0);
		scd.put("customizationId", customizationId);
		if(projectUuid!=null)scd.put("projectId", projectUuid);
		return scd;
	}
	
	public boolean vcsClientExportProject(Map<String, Object> scd, int startCommitId) throws JSONException { //TODO
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientExportProject", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);

		List lp = new ArrayList();lp.add(projectUuid);lp.add(customizationId);
		Map mo = (Map)dao.executeSQLQuery2Map("select * from iwb.w5_project t where t.project_uuid=? AND t.customization_id=?", lp).get(0);
		params.put("object", GenericUtil.fromMapToJSONObject(mo));
		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSExportProject";
	/*	String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			
		}*/
		
		String s = HttpUtil.sendJson(url, params);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			json = new JSONObject(s);
			if(json.get("success").toString().equals("true")){
				return true;
			} else
				throw new IWBException("vcs","vcsClientExportProject:server Error Response", 0, s, json.getString("error"), null);
		}
		return false;
	}
	
	public boolean vcsServerExportProject(String userName, String passWord, int customizationId, JSONObject project) throws JSONException {//TODO
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, null);
		int userId = (Integer)scd.get("userId");
		String projectUuid = project.getString("project_uuid");
		List lp =dao.find("from W5Project t where t.projectUuid=? AND t.customizationId=?", projectUuid, customizationId);
		if(lp.isEmpty()){
			return dao.executeUpdateSQLQuery("INSERT INTO iwb.w5_project(project_uuid, customization_id, dsc, project_status_tip, version_no, insert_user_id, insert_dttm, version_user_id, version_dttm, access_users, "
					+ "rdbms_flag, rdbms_tip, project_code, vcs_flag, vcs_url, vcs_user_name,"
					+ "vcs_password, ui_web_frontend_tip, ui_mobile_flag, ui_mobile_frontend_tip, kanban_flag, rdbms_schema) VALUES "
					+ "(?, ?, ?, 1, 1, ?, current_timestamp, ?, current_timestamp, '10',"
					+ "1, ?, null, 1, null, null,"
					+ "null, 1, 0, 0, 1, ?)",projectUuid, customizationId, project.getString("dsc"), userId, userId, project.getInt("rdbms_tip"), project.getString("rdbms_schema"))==1;
		}

		return true;
	}
	
	public int vcsClientObjectPushMulti(Map<String, Object> scd, int tableId, String tablePks, boolean force, boolean recursive, boolean onSynchErrorThrow) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectPushMulti",0,null, "VCS Server not allowed to vcsClientObjectPushMulti", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPushMulti", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPushMulti", tableId, null, "Not VCS Table", null);
		}
		
//		StringBuilder urlParameters = new StringBuilder();
//		urlParameters.append("u=").append(po.getVcsUserName()).append("&p=").append(po.getVcsPassword()).append("&t=").append(tableId).append("&c=").append(customizationId).append("&r=").append(projectUuid);
		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);params.put("t", tableId);params.put("r", projectUuid);

//		if(force)urlParameters.append("&f=1");
		if(force)params.put("f", 1);

		String[] arTablePks = tablePks.split(",");
		
		
		Map<Integer, W5VcsObject> mv = new HashMap();
//		List lo = new ArrayList();
		JSONArray jlo = new JSONArray();
		for(String k:arTablePks){
			int tablePk = GenericUtil.uInt(k);
			W5VcsObject vo = (W5VcsObject)dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", tableId, tablePk, customizationId, projectUuid).get(0);
			if(vo.getVcsObjectStatusTip()==9){//synch durumdaysa Push'a gerek yok
				if(onSynchErrorThrow)throw new IWBException("vcs","vcsClientObjectPushMulti", vo.getVcsObjectId(), null, "Object Already Synched2", null);
				else continue;
			}
			int action= vo.getVcsObjectStatusTip();

			Map o = new HashMap();
			if(action!=3)o.put("o", dao.getTableRecordJson(scd, t.getTableId(), vo.getTablePk(), 0));
			o.put("a", action);
			o.put("k", tablePk);
			if(action!=2)o.put("c", vo.getVcsCommitId());
			mv.put(tablePk, vo);
			jlo.put(GenericUtil.fromMapToJSONObject(o));
			
		}
		if(jlo.length()==0)
			throw new IWBException("vcs","vcsClientObjectPushMulti", t.getTableId(), null, "No Record to Push", null);

		
		params.put("objects", jlo);

		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectPushMulti";
		String s = HttpUtil.sendJson(url, params);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					int srvVcsCommitId =json.getInt("commit_id");
					for(Integer k:mv.keySet()){
						W5VcsObject vo = mv.get(k);
						vo.setVersionNo((short)(vo.getVersionNo()+1));
						vo.setVersionUserId((Integer)scd.get("userId"));
						vo.setVcsCommitId(srvVcsCommitId);					
						vo.setVcsObjectStatusTip((short)(vo.getVcsObjectStatusTip()==3 ? 8:9));//8:synched deleted, 9:synched updated/inserted
						vo.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, t.getTableId(), vo.getTablePk()));
						dao.updateObject(vo);	
					}
					return srvVcsCommitId;
				} else
					throw new IWBException("vcs","vcsClientObjectPushMulti:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectPushMulti:JSONException", t.getTableId(), s, e.getMessage(), e.getCause());
			}
		}
		return 0;
	}

	synchronized public int vcsServerObjectPushMulti(String userName, String passWord, int customizationId, String projectId, int tableId, boolean force, JSONArray ja, String comment) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPushMulti",0,null, "Not a VCS Server to vcsServerObjectPushMulti", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPushMulti", 0, projectId, "No VCS for this Project2", null);
		}
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPushMulti", t.getTableId(), null, "Not VCS Table2", null);
		}
		
		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", projectId);
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)commit.setVcsCommitId(1);
		else commit.setVcsCommitId((Integer)lm.get(0)+1);
		commit.setProjectUuid(projectId);commit.setComment(comment);
		dao.saveObject(commit);

		try {
			for(int qi=0;qi<ja.length();qi++){
				JSONObject jo = ja.getJSONObject(qi);
				
				int action = jo.getInt("a");
				int tablePk = jo.getInt("k");
				List l = action!=2 ? dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
						tableId, tablePk, projectId, customizationId) : null;
				if(action != 2 && GenericUtil.isEmpty(l))
					throw new IWBException("vcs","vcsServerObjectPushMulti", t.getTableId(), "Not Found", "Not VCS Object2", null);
				W5VcsObject o;
				
				if(action!=2)
					o = (W5VcsObject)l.get(0);
				else {
					o = new W5VcsObject(scd, t.getTableId(), tablePk);
				}
				if(!force && action!=2 && o.getVcsCommitId()>jo.getInt("c")) 
					throw new IWBException("vcs","vcsServerObjectPushMulti", t.getTableId(), "Conflicts", "Conflicts for Specified Object2", null);
				
				o.setVcsObjectStatusTip((short)(action==3 ? 8:9));
				if(action==3)
					o.setVcsCommitRecordHash(dao.getTableRecordSummary(scd, tableId, tablePk, 32));
				dao.saveVcsObject(scd, tableId, tablePk, action, action==3 ? null : jo.getJSONObject("o"));
				if(action!=3)
					o.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, tableId, tablePk));
				o.setVcsCommitId(commit.getVcsCommitId());
				if(o.getVcsObjectId()==0)
					dao.saveObject(o);
				else
					dao.updateObject(o);

			}
		} catch (JSONException e) {
			throw new IWBException("vcs","vcsServerObjectPushMulti", t.getTableId(), "JSONException", e.getMessage(), e.getCause());
		}
		
		return commit.getVcsCommitId();
	}
	
	synchronized public int vcsServerObjectPushAll(String userName, String passWord, int customizationId, String projectId, boolean force, JSONArray ja, String comment) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPushAll",0,null, "Not a VCS Server to vcsServerObjectPushAll", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectPushMulti", 0, projectId, "No VCS for this Project2", null);
		}

		
		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", projectId);
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)commit.setVcsCommitId(1);
		else commit.setVcsCommitId((Integer)lm.get(0)+1);
		commit.setProjectUuid(projectId);commit.setComment(comment);
		dao.saveObject(commit);

		try {
			for(int qi=0;qi<ja.length();qi++){
				JSONObject jo = ja.getJSONObject(qi);
				
				int action = jo.getInt("a");
				int tablePk = jo.getInt("k");
				int tableId = jo.getInt("t");
				List l = action!=2 ? dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.projectUuid=? AND t.customizationId=?", 
						tableId, tablePk, projectId, customizationId) : null;
				if(action != 2 && GenericUtil.isEmpty(l))
					throw new IWBException("vcs","vcsServerObjectPushAll", tableId, "Not Found", "Not VCS Object2", null);
				W5VcsObject o;
				
				if(action!=2)
					o = (W5VcsObject)l.get(0);
				else {
					o = new W5VcsObject(scd, tableId, tablePk);
				}
				if(!force && action!=2 && o.getVcsCommitId()>jo.getInt("c")) 
					throw new IWBException("vcs","vcsServerObjectPushAll", tableId, "Conflicts", "Conflicts for Specified Object2", null);
				
				o.setVcsObjectStatusTip((short)(action==3 ? 8:9));
				if(action==3)
					o.setVcsCommitRecordHash(dao.getTableRecordSummary(scd, tableId, tablePk, 32));
				dao.saveVcsObject(scd, tableId, tablePk, action, action==3 ? null : jo.getJSONObject("o"));
				if(action!=3)
					o.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, tableId, tablePk));
				o.setVcsCommitId(commit.getVcsCommitId());
				if(o.getVcsObjectId()==0)
					dao.saveObject(o);
				else
					dao.updateObject(o);

			}
		} catch (JSONException e) {
			throw new IWBException("vcs","vcsServerObjectPushAll", 0, "JSONException", e.getMessage(), e.getCause());
		}
		
		return commit.getVcsCommitId();
	}

	public Map vcsServerObjectsDetail(String userName, String passWord, int customizationId, String projectId, JSONArray ja) {
//		if(!FrameworkSetting.vcsServer)throw new PromisException("vcs","vcsServerObjectsDetail",0,null, "Not a VCS Server to vcsServerObjectsDetail", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectsDetail", 0, projectId, "No VCS for this Project2", null);
		}

		Map m = new HashMap();
		m.put("success", true);
		try {
			List l = new ArrayList();
			m.put("data", l);
			for(int qi=0;qi<ja.length();qi++){
				String[] pk = ja.getString(qi).replace('.', ',').split(",");
				
				int tableId = GenericUtil.uInt(pk[0]);
				int tablePk = GenericUtil.uInt(pk[1]);
				W5Table t = FrameworkCache.getTable(0, tableId);
				if(t.getVcsFlag()!=0){ //master olanlar haric
					List<W5VcsObject> l2 = dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=?", 
							tableId, tablePk, customizationId);
					if(!l2.isEmpty()){
						Map m2 = new HashMap();
						m2.put("id", tableId + "." + tablePk);
						W5VcsObject vo = l2.get(0);
						m2.put("user_id", vo.getVersionUserId());
						String userDsc = UserUtil.getUserName(customizationId, vo.getVersionUserId());
						if(!GenericUtil.isEmpty(userDsc))m2.put("user_dsc", userDsc);
						m2.put("commit_dttm", GenericUtil.uFormatDateTime(vo.getVersionDttm()));
						l.add(m2);
						if(t.getTableTip()!=0){ // master olanlar haric
							List<W5TableRecordHelper> pr = dao.findRecordParentRecords(scd, tableId, tablePk, 2, false);
							if(!GenericUtil.isEmpty(pr)){
								m2.put("dsc", pr.get(0).getRecordDsc());
								if(pr.size()>1)m2.put("parent", pr.get(1).getTableId() + "." + pr.get(1).getTablePk());
							}
						} else {
							List<W5TableRecordHelper> pr = dao.findRecordParentRecords(scd, tableId, tablePk, 1, false);
							if(!GenericUtil.isEmpty(pr)){
								m2.put("dsc", pr.get(0).getRecordDsc());
							}
							
						}
					}
				}
			}
		} catch (JSONException e) {
			throw new IWBException("vcs","vcsServerObjectsDetail", 0, "JSONException", e.getMessage(), e.getCause());
		}
		
		return m;
	}


	public Map vcsServerObjectsAll(String userName, String passWord, int customizationId, String projectId, String schema) {
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, null);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerObjectsAll", 0, projectId, "No VCS for this Project2", null);
		}
		List<W5VcsObject> l = null;
		if(GenericUtil.isEmpty(schema)){
			l = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? order by t.tableId, t.vcsCommitId, t.tablePk", projectId, customizationId);
		} else {
			if(!schema.endsWith("%"))schema+="%";
			l = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? and exists(select 1 from W5Table q where q.customizationId=t.customizationId AND q.tableId=t.tableId AND q.dsc like ?) order by t.tableId, t.vcsCommitId, t.tablePk", projectId, customizationId,schema) ;
		}
		Map m = new HashMap();
		m.put("success", true);
		Map<Integer, List> mall = new HashMap();
		W5Table lastTable = null;
		List<Map> l2=null;
		for(W5VcsObject ox:l){
			if(lastTable == null || lastTable.getTableId()!=ox.getTableId()){
				lastTable = FrameworkCache.getTable(customizationId, ox.getTableId());
				if(lastTable!=null && lastTable.getVcsFlag()!=0){
					l2= new ArrayList();
					mall.put(ox.getTableId(), l2);
				}
			}
			if(lastTable!=null && lastTable.getVcsFlag()!=0){
				Map m2 = new HashMap();
				m2.put(ox.getTablePk(), ox.getVcsObjectStatusTip()==8 ? -ox.getVcsCommitId() : ox.getVcsCommitId());
				l2.add(m2);
			}
		}
		m.put("list", mall);
		return m;		
	}
	
	public int vcsClientCleanVCSObjects(Map<String, Object> scd, int tableId) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientCleanVCSObjects",0,null, "VCS Server not allowed to vcsClientCleanVCSObjects", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientCleanVCSObjects", 0, projectUuid, "No VCS for this Project2", null);
		}
		int count =0;
		if(tableId==-1){
			List<Integer> ps = dao.executeSQLQuery("select q.table_id from iwb.w5_table q where q.vcs_flag=1 AND q.project_uuid=?", projectUuid);
			if(ps!=null)for(Integer tid:ps){
				W5Table t = FrameworkCache.getTable(customizationId, tid);
				String sql ="from iwb.w5_vcs_object where vcs_object_status_tip in (1,2,9) "
						+ "and table_id=? and customization_id=? AND table_pk not in (select q."+t.get_tableParamList().get(0).getExpressionDsc()+" from "+t.getDsc()+" q where q.customization_id=?)";
				int newCount = GenericUtil.uInt(dao.executeSQLQuery("select count(1) " +sql, tableId, customizationId, customizationId).get(0));
				if(newCount>0){
					count += newCount;
					dao.executeUpdateSQLQuery("delete " + sql, tableId, customizationId, customizationId);
				}
			}
		} else {
			W5Table t = FrameworkCache.getTable(customizationId, tableId);
			if(t.getVcsFlag()==0){
				throw new IWBException("vcs","vcsClientObjectsList", t.getTableId(), t.getDsc(), "Not VCS Table2", null);
			}
			String sql ="from iwb.w5_vcs_object where vcs_object_status_tip in (1,2,9) "
					+ "and table_id=? and customization_id=? AND table_pk not in (select q."+t.get_tableParamList().get(0).getExpressionDsc()+" from "+t.getDsc()+" q where q.customization_id=?)";
			count = GenericUtil.uInt(dao.executeSQLQuery("select count(1) " +sql, tableId, customizationId, customizationId).get(0));
			if(count>0)dao.executeUpdateSQLQuery("delete " + sql, tableId, customizationId, customizationId);

			sql ="from iwb.w5_vcs_object where vcs_object_status_tip in (1,2,9) "
					+ "and table_id=? and customization_id=? AND table_pk not in (select q."+t.get_tableParamList().get(0).getExpressionDsc()+" from "+t.getDsc()+" q where q.customization_id=?)";
			count = GenericUtil.uInt(dao.executeSQLQuery("select count(1) " +sql, tableId, customizationId, customizationId).get(0));

		}
		return count;
	}

	public int vcsClientVCSObjectsMasterDetailFix(Map<String, Object> scd) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientCleanVCSObjects",0,null, "VCS Server not allowed to vcsClientCleanVCSObjects", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientCleanVCSObjects", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		return 0;
	}

	public int vcsClientObjectPushAll(Map<String, Object> scd, String tableKeys, boolean force, boolean recursive, boolean onSynchErrorThrow) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectPushAll",0,null, "VCS Server not allowed to vcsClientObjectPushAll", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectPushAll", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		
//		StringBuilder urlParameters = new StringBuilder();
//		urlParameters.append("u=").append(po.getVcsUserName()).append("&p=").append(po.getVcsPassword()).append("&c=").append(customizationId).append("&r=").append(projectUuid);
		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);params.put("r", projectUuid);

//		if(force)urlParameters.append("&f=1");
		if(force)params.put("f", 1);
		String[] arTableKeys = tableKeys.split(",");
		
		
		Map<String, W5VcsObject> mv = new HashMap();
//		List lo = new ArrayList();
		JSONArray jlo = new JSONArray();
		for(String k:arTableKeys){
			String[] tableKey = k.replace('.', ',').split(",");
			int tableId=GenericUtil.uInt(tableKey[0]);
			if(FrameworkCache.getTable(customizationId, tableId).getVcsFlag()==0){
				if(onSynchErrorThrow)
					throw new IWBException("vcs","vcsClientObjectPushAll", 0, projectUuid, "Not VCS Table", null);
				continue;
			}
			int tablePk=GenericUtil.uInt(tableKey[1]);
			W5VcsObject vo = (W5VcsObject)dao.find("from W5VcsObject t where t.tableId=? AND t.tablePk=? AND t.customizationId=? AND t.projectUuid=?", tableId, tablePk, customizationId, projectUuid).get(0);
			if(vo.getVcsObjectStatusTip()==9){//synch durumdaysa Push'a gerek yok
				if(onSynchErrorThrow)throw new IWBException("vcs","vcsClientObjectPushAll", vo.getVcsObjectId(), null, "Object Already Synched2", null);	else 
					continue;
			}
			int action= vo.getVcsObjectStatusTip();

			Map o = new HashMap();
			if(action!=3)o.put("o", dao.getTableRecordJson(scd, tableId, vo.getTablePk(), 0));
			o.put("a", action);
			o.put("t", tableId);
			o.put("k", tablePk);
			if(action!=2)o.put("c", vo.getVcsCommitId());
			mv.put(k, vo);
			jlo.put(GenericUtil.fromMapToJSONObject(o));			
		}
		if(jlo.length()==0)
			throw new IWBException("vcs","vcsClientObjectPushAll", 0, null, "No Record to Push", null);

		
		params.put("objects", jlo);
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectPushAll";
		String s = HttpUtil.sendJson(url, params);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					int srvVcsCommitId =json.getInt("commit_id");
					for(String k:mv.keySet()){
						W5VcsObject vo = mv.get(k);
						vo.setVersionNo((short)(vo.getVersionNo()+1));
						vo.setVersionUserId((Integer)scd.get("userId"));
						vo.setVcsCommitId(srvVcsCommitId);					
						vo.setVcsObjectStatusTip((short)(vo.getVcsObjectStatusTip()==3 ? 8:9));//8:synched deleted, 9:synched updated/inserted
						vo.setVcsCommitRecordHash(dao.getObjectVcsHash(scd, vo.getTableId(), vo.getTablePk()));
						dao.updateObject(vo);	
					}
					return srvVcsCommitId;
				} else
					throw new IWBException("vcs","vcsClientObjectPushAll:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientObjectPushAll:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		return 0;
	}
	public W5QueryResult vcsClientDBObjectList(Map<String, Object> scd) {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientDBObjectList", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		StringBuilder urlParameters = new StringBuilder();
		urlParameters.append("u=").append(po.getVcsUserName()).append("&p=").append(po.getVcsPassword()).append("&c=").append(customizationId).append("&r=").append(projectUuid);
		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverDBObjectAll";
		
		String s = HttpUtil.send(url, urlParameters.toString());
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONArray ar =json.getJSONArray("list");
					
					List ps=new ArrayList();ps.add(po.getRdbmsSchema());
					List<Map> ltables = dao.executeSQLQuery2Map("select x.table_name dsc, iwb.md5hash((select string_agg(y.column_name||'.'||y.is_nullable||'.'||y.data_type||'.'||coalesce(y.character_maximum_length,0)::text,',' order by ordinal_position) src_md5hash from information_schema.columns y "
					+ " where y.table_schema=x.table_schema "
					+ " AND y.table_name=x.table_name "
					+ ")) src_md5hash from information_schema.tables x "
					+ " where x.table_schema=? order by table_name", ps);
			
					List<Map> ldb_funcs = dao.executeSQLQuery2Map("select x.proname||replace(replace(coalesce(x.proargnames::text,''),'{','('),'}',')') dsc, iwb.md5hash(coalesce(x.proargnames::text,'')||coalesce(x.proargtypes::text,'') ||x.prosrc) src_md5hash from pg_proc x where x.pronamespace=(select q.oid from pg_namespace q where q.nspname=?) order by dsc"
					, ps);
					
					Map<String, String> mlc = new HashMap();
					if(!GenericUtil.isEmpty(ltables))for(Map o:ltables) {
						mlc.put("1."+o.get("dsc"), (String)o.get("src_md5hash"));
					}
					if(!GenericUtil.isEmpty(ldb_funcs))for(Map o:ldb_funcs) {
						mlc.put("2."+o.get("dsc"), (String)o.get("src_md5hash"));
					}
					
					W5QueryResult qr = dao.getQueryResult(scd, 2768);
					qr.setErrorMap(new HashMap());qr.setNewQueryFields(new ArrayList(qr.getQuery().get_queryFields().size()));qr.getNewQueryFields().addAll(qr.getQuery().get_queryFields());
					List data = new ArrayList();
					for(int qi=0;qi<ar.length();qi++) {
						JSONObject jo = ar.getJSONObject(qi);
						String key = jo.getInt("tip")+"."+jo.getString("dsc");
						String lclHash = (String)mlc.get(key);
						Object[] ox = new Object[5];
						ox[0] = jo.getInt("tip");
						ox[1] = jo.getString("dsc");
						if(lclHash==null) { //romte'da var local de yok
							ox[2] = 1; //push
						} else if(!lclHash.equals(jo.getString("src_md5hash"))){
							ox[2] =  3; //conflict
						} else {
							mlc.remove(key);
							continue;
						}
						mlc.remove(key);
						data.add(ox);
					}
					
					for(String k:mlc.keySet()) {
						Object[] ox = new Object[5];
						ox[0] = k.substring(0,1);
						ox[1] = k.substring(2);
						ox[2] = 2; //push
						data.add(ox);
					}
					
					qr.setData(data);
					return qr;
				} else
					throw new IWBException("vcs","vcsClientDBObjectList:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientDBObjectList:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		
		
		return null;
	}
		
		
	public Map serverDBObjectAll(String userName, String passWord, int customizationId, String projectId) {
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","serverDBObjectAll", 0, projectId, "No VCS for this Project2", null);
		}
		

		Map m = new HashMap();

		List ps=new ArrayList();ps.add(po.getRdbmsSchema());
		List<Map> ltables = dao.executeSQLQuery2Map("select 1 tip, x.table_name dsc, iwb.md5hash((select string_agg(y.column_name||'.'||y.is_nullable||'.'||y.data_type||'.'||coalesce(y.character_maximum_length,0)::text,',' order by ordinal_position) src_md5hash from information_schema.columns y "
			+ " where y.table_schema=x.table_schema "
			+ " AND y.table_name=x.table_name "
			+ ")) src_md5hash from information_schema.tables x "
			+ " where x.table_schema=? order by table_name", ps);
		List<Map> ldb_funcs = dao.executeSQLQuery2Map("select 2 tip, x.proname||replace(replace(coalesce(x.proargnames::text,''),'{','('),'}',')') dsc, iwb.md5hash(coalesce(x.proargnames::text,'')||coalesce(x.proargtypes::text,'') ||x.prosrc) src_md5hash from pg_proc x where x.pronamespace=(select q.oid from pg_namespace q where q.nspname=?) order by dsc"
				, ps);
		
		
		List all = new ArrayList();
		if(!GenericUtil.isEmpty(ltables))all.addAll(ltables);
		if(!GenericUtil.isEmpty(ldb_funcs))all.addAll(ldb_funcs);
		m.put("success", true);
		m.put("list", all);
		return m;
	}

	
	synchronized public Map vcsServerSQLCommit(String userName, String passWord, int customizationId, String projectId, String sql, String comment) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerSQLCommit",0,null, "Not VCS Server to vcsServerSQLCommit", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","serverDBObjectAll", 0, projectId, "No VCS for this Project2", null);
		}
		
		//TODO, biraz inceleme gerekebilir
		int cnt = dao.executeUpdateSQLQuery(sql);
		
		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", projectId);
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)commit.setVcsCommitId(1);
		else commit.setVcsCommitId((Integer)lm.get(0)+1);
		commit.setProjectUuid(projectId);commit.setComment(comment);
		commit.setExtraSql(sql);
		dao.saveObject(commit);
		Map m = new HashMap();
		m.put("success", true);
		m.put("cnt", cnt);
		return m;
	}

	public String vcsClientSqlCommitList(Map<String, Object> scd) {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","No VCS for this Project", 0, projectUuid, "No VCS for this Project2", null);
		}

		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", po.getProjectUuid());
		int lastCommitId = 0;
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)lastCommitId = 0;
		else lastCommitId = (Integer)lm.get(0);
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&q=2770&l="+lastCommitId;
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		return HttpUtil.send(url, urlParameters);
	}


	public W5QueryResult vcsServerQueryResult(String userName, String passWord, int customizationId, String projectId,
			int queryId, Map<String,String>  requestParams) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerQueryResult",0,null, "Not VCS Server to vcsServerQueryResult", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		return runQuery(scd, queryId, requestParams);
	}

	public W5QueryResult runQuery(Map scd, int queryId, Map<String,String>  requestParams) {
		W5QueryResult queryResult = dao.getQueryResult(scd,queryId);

/*		StringBuilder tmpx = new StringBuilder("ali baba ${obj.dsc} ve 40 haramiler ${lnk.pk_query_field_id.dsc} olmus");
		dao.interprateTemplate(scd, 5,1294, tmpx, true); */
		queryResult.setErrorMap(new HashMap());
		queryResult.setRequestParams(requestParams);
		
//		queryResult.setOrderBy(PromisUtil.uStrNvl(requestParams.get(PromisUtil.uStrNvl(PromisSetting.appSettings.get("sql_sort"),"sort")), queryResult.getQuery().getSqlOrderby()));
		queryResult.setOrderBy(queryResult.getQuery().getSqlOrderby());		
		switch(queryResult.getQuery().getQueryTip()){
		case	9:case	10:queryResult.prepareTreeQuery(null);break;
		case	15:queryResult.prepareDataViewQuery(null);break;
		default:queryResult.prepareQuery(null);
		}
		if(queryResult.getErrorMap().isEmpty()){
			QueryTrigger.beforeExecuteQuery(queryResult, dao);
	        queryResult.setFetchRowCount(GenericUtil.uIntNvl(requestParams, "limit", GenericUtil.uInt(requestParams,"firstLimit")));
	        queryResult.setStartRowNumber(GenericUtil.uInt(requestParams,"start"));
        	dao.runQuery(queryResult);
        	if(queryResult.getQuery().getShowParentRecordFlag()!=0 && queryResult.getData()!=null){
        		for(Object[] oz:queryResult.getData()){
        			int tableId = GenericUtil.uInt(oz[queryResult.getQuery().get_tableIdTabOrder()-1]);
        			int tablePk = GenericUtil.uInt(oz[queryResult.getQuery().get_tablePkTabOrder()-1]);
        			if(tableId!=0 && tablePk!=0)oz[oz.length-1]=dao.findRecordParentRecords(scd, tableId, tablePk, 0, true);
        		}
        	}
	    	QueryTrigger.afterExecuteQuery(queryResult, dao);
		}
		return queryResult;
	}


	synchronized public int vcsClientSqlCommitsFetchAndRun(Map<String, Object> scd) {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientSqlCommitsFetchAndRun",0,null, "VCS Server not allowed to vcsClientSqlCommitsFetchAndRun", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientSqlCommitsFetchAndRun", 0, projectUuid, "No VCS for this Project2", null);
		}

		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", po.getProjectUuid());
		int lastCommitId = 0;
		if(lm.isEmpty() || lm.get(0)==null)lastCommitId = 0;
		else lastCommitId = (Integer)lm.get(0);
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&q=2770&l="+lastCommitId;
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		String s = HttpUtil.send(url, urlParameters);
		
		int result = 0;
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONArray ar = json.getJSONArray("data");
					for(int qi=0;qi<ar.length();qi++){
						JSONObject o = ar.getJSONObject(ar.length()-1-qi);
						if(o.has("extra_sql")){
							String extraSql = o.getString("extra_sql");
							if(!GenericUtil.isEmpty(extraSql)){
								if(po.getSetSearchPathFlag()!=0){
									dao.executeUpdateSQLQuery("set search_path="+po.getRdbmsSchema());
								} else 
									dao.executeUpdateSQLQuery("set search_path=iwb");
								result+=dao.executeUpdateSQLQuery(extraSql);
							}
						}
						dao.saveObject(new W5VcsCommit(o));
					}
				} else
					throw new IWBException("vcs","vcsClientSqlCommitsFetchAndRun:server Error Response", 0, s, json.getString("error"), null);
			} catch (IWBException e){
				throw e;
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientSqlCommitsFetchAndRun:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		return result;
	}
	
	synchronized public int vcsServerAddSQL(String userName, String passWord, int customizationId, String projectId,
			String sql, String comment) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerAddSQL",0,null, "Not VCS Server to vcsServerAddSQL", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, null);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerAddSQL", 0, projectId, "No VCS for this Project2", null);
		}
		if(po.getSetSearchPathFlag()!=0){
			dao.executeUpdateSQLQuery("set search_path="+po.getRdbmsSchema());
		} 
		
		int result = dao.executeUpdateSQLQuery(sql);
		
		W5VcsCommit commit = new W5VcsCommit();
		commit.setCommitTip((short)2);
		commit.setExtraSql(sql);
		commit.setProjectUuid(projectId);
		commit.setComment(comment);
		commit.setCommitUserId((Integer)scd.get("userId"));

		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", po.getProjectUuid());
		int lastCommitId = 0;
		if(lm.isEmpty() || lm.get(0)==null)lastCommitId = 0;
		else lastCommitId = (Integer)lm.get(0);

		commit.setVcsCommitId(lastCommitId+1);
		dao.saveObject(commit);
		
		return commit.getVcsCommitId();
	}


	public int vcsClientPushSql(Map<String, Object> scd, int commitId) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientPushSql",0,null, "VCS Server not allowed to vcsClientAddSql", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientPushSql", 0, projectUuid, "No VCS for this Project2", null);
		}

		String serverQR = vcsClientSqlCommitList(scd);
		if(!GenericUtil.isEmpty(serverQR))try {
			JSONObject json2 = new JSONObject(serverQR);
			JSONArray ar2 = json2.getJSONArray("data");
			if(ar2.length()>0){
				throw new IWBException("vcs","vcsClientPushSql", 0, serverQR, "You have to Fetch And Run Server SQLs First!!!", null);
			}
		} catch (JSONException e){
			throw new IWBException("vcs","vcsClientPushSql:JSONException", 0, serverQR, e.getMessage(), e.getCause());
		}
		
//		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&s="+GenericUtil.uUrlEncode(sql)+"&comment="+GenericUtil.uUrlEncode(comment);

		W5VcsCommit co = (W5VcsCommit)dao.find("from W5VcsCommit c where c.projectUuid=? AND c.vcsCommitId=?", projectUuid, commitId).get(0);

		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);
		params.put("r", po.getProjectUuid());params.put("s", co.getExtraSql());params.put("comment", co.getComment());

		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSAddSql";
		String s = HttpUtil.sendJson(url, params);
		
		int result = 0;
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					dao.executeUpdateSQLQuery("update iwb.w5_vcs_commit set vcs_commit_id=?, commit_user_id=?, commit_dttm=current_timestamp where vcs_commit_id=?", json.getInt("cnt"), (Integer)scd.get("userId"), commitId);
					return json.getInt("cnt");
				} else
					throw new IWBException("vcs","vcsClientPushSql:server Error Response", 0, s, json.getString("error"), null);
			} catch (IWBException e){
				throw e;
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientPushSql:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		return 0;
	}


	public int vcsClientPushSqlRT(Map<String, Object> scd, String sql, String comment) throws JSONException {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientPushSqlRT",0,null, "VCS Server not allowed to vcsClientPushSqlRT", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientPushSqlRT", 0, projectUuid, "No VCS for this Project2", null);
		}

		String serverQR = vcsClientSqlCommitList(scd);
		if(!GenericUtil.isEmpty(serverQR))try {
			JSONObject json2 = new JSONObject(serverQR);
			JSONArray ar2 = json2.getJSONArray("data");
			if(ar2.length()>0){
				throw new IWBException("vcs","vcsClientPushSqlRT", 0, serverQR, "You have to Fetch And Run Server SQLs First!!!", null);
			}
		} catch (JSONException e){
			throw new IWBException("vcs","vcsClientPushSqlRT:JSONException", 0, serverQR, e.getMessage(), e.getCause());
		}
		
//		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&s="+GenericUtil.uUrlEncode(sql)+"&comment="+GenericUtil.uUrlEncode(comment);


		JSONObject params = new JSONObject(); 
		params.put("u", po.getVcsUserName());params.put("p", po.getVcsPassword());params.put("c", customizationId);
		params.put("r", po.getProjectUuid());params.put("s", sql);params.put("comment", comment);

		
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSAddSql";
		String s = HttpUtil.sendJson(url, params);
		
		int result = 0;
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					dao.executeUpdateSQLQuery("INSERT INTO iwb.w5_vcs_commit(vcs_commit_id, project_uuid, comment, commit_user_id, commit_ip, extra_sql, commit_tip) "
							+ "VALUES (?, ?, ?, ?, ?, ?, ?)", json.getInt("cnt"), projectUuid, comment, (Integer)scd.get("userId"), "localhost", sql, 2);
					return json.getInt("cnt");
				} else
					throw new IWBException("vcs","vcsClientPushSqlRT:server Error Response", 0, s, json.getString("error"), null);
			} catch (IWBException e){
				throw e;
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientPushSqlRT:JSONException", 0, s, e.getMessage(), e.getCause());
			}
		}
		return 0;
	}


	public int vcsClientObjectAction(Map<String, Object> scd, int tableId, int tablePk, int action) {
		if(FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientObjectAction",0,null, "VCS Server not allowed to vcsClientObjectAction", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectAction", 0, projectUuid, "No VCS for this Project2", null);
		}
		W5Table t = FrameworkCache.getTable(customizationId, tableId);
		if(customizationId>0 && t ==null)t = FrameworkCache.getTable(0, tableId);
		if(t==null)return 0;
		if(t.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientObjectAction", t.getTableId(), po.getProjectUuid()+"!="+projectUuid, "Not VCS Table2", null);
		}
		switch(action){
		case	3://delete
			return dao.executeUpdateSQLQuery("delete from iwb.w5_vcs_object where table_id=? AND table_pk=? AND customization_id=? AND project_uuid=?", tableId, tablePk, customizationId, projectUuid);
		case	2://insert
			dao.saveObject(new W5VcsObject(scd, tableId, tablePk));
			return 1;		
		}

		return 0;
	}


	public W5QueryResult vcsClientTableConflicts(Map<String, Object> scd, String tableName) throws JSONException {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientTableConflicts", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid();
		urlParameters+="&q=141&xtable_name="+tableName+"&xowner="+po.getRdbmsSchema();
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		String s = HttpUtil.send(url, urlParameters);
		Map rm = new HashMap(); rm.put("xtable_name", tableName);rm.put("xowner", po.getRdbmsSchema());
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			json = new JSONObject(s);
			if(json.get("success").toString().equals("true")){
				W5QueryResult local = runQuery(scd, 141, rm);
				JSONArray data = json.getJSONArray("data");
				Map<String, JSONObject> remoteColumns = new HashMap();
				for(int qi=0;qi<data.length();qi++){
					remoteColumns.put(data.getJSONObject(qi).getString("column_name"), data.getJSONObject(qi));
				}
				
				for(int qi=0;qi<local.getData().size();qi++){
					Object[] localColumn = local.getData().get(qi);
					localColumn[31]=0;
					JSONObject remoteColumn = remoteColumns.get((String)localColumn[3]); //column_name
					if(remoteColumn==null){ // remote'da yok, local'de var
						localColumn[31]=2;
					} else {
						for(W5QueryField f:local.getQuery().get_queryFields())if(GenericUtil.hasPartInside2("6,7,8,9,11,12,13,14", f.getTabOrder())){
							Object o = remoteColumn.get(f.getDsc());
							if(!GenericUtil.safeEquals2(localColumn[f.getTabOrder()-1],o)){
								localColumn[31]=1;
								localColumn[f.getTabOrder()-1]="!"+localColumn[f.getTabOrder()-1]+"!"+o;
							}
						}
						remoteColumn.remove((String)localColumn[3]);
					}
				}
				if(!remoteColumns.isEmpty())for(String k:remoteColumns.keySet()){
					Object[] newRec = new  Object[45];
					JSONObject remoteColumn = remoteColumns.get(k);
					for(W5QueryField f:local.getQuery().get_queryFields()){
						newRec[f.getTabOrder()-1] = remoteColumn.get(f.getDsc());
					}
					newRec[31] = 3; //remote'da var, locale'de yok
				}
				return local;
				
			}
		}
		return null;
	}
	
	
	public Map vcsClientDBFuncDetail(Map<String, Object> scd, String dbFuncName) throws JSONException {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientDBFuncDetail", 0, projectUuid, "No VCS for this Project2", null);
		}
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid();
		urlParameters+="&q=301&f="+dbFuncName+"&s="+po.getRdbmsSchema();
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		String s = HttpUtil.send(url, urlParameters);
		Map result = new HashMap();
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			json = new JSONObject(s);
			if(json.get("success").toString().equals("true")){
				if(json.has("data")){
					JSONArray rx= json.getJSONArray("data");
					if(rx.length()>0)
						result.put("rmt", rx.getJSONObject(0).getString("src"));
				}
				
			}
		}
		
		Map rm = new HashMap(); rm.put("f", dbFuncName);rm.put("s", po.getRdbmsSchema());
		W5QueryResult local = runQuery(scd, 301, rm);
		if(local.getData().size()>0){
			result.put("lcl", local.getData().get(0)[0]);
		}
		return result;
	}


	public boolean vcsFix(Map<String, Object> scd, int tid, int action) throws JSONException {
		if(action==1){
			vcsClientCleanVCSObjects(scd, tid);
			return true;
		}
		

		if(action!=3 && action!=5 && FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsClientFix",0,null, "VCS Server not allowed to vcsClientFix", null);
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientFix", 0, projectUuid, "No VCS for this Project2", null);
		}
		StringBuilder gsql = new StringBuilder();List<Object> gparams = new ArrayList();
		W5Table mt = FrameworkCache.getTable(customizationId, tid);
		if(mt.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientFix", mt.getTableId(), po.getProjectUuid()+"!="+projectUuid, "Not VCS Table2", null);
		}
		List params = new ArrayList();
		StringBuilder sql = new StringBuilder();
		switch(action){
		case	2://REC.projectUiid!=VCS_OBJECT .projectUiid for INSERT
			sql.append("update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.project_uuid!=? AND v.table_id=? AND v.vcs_object_status_tip=2 AND exists(select 1 from ").append(mt.getDsc())
				.append(" d where d.project_uuid=? AND d.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
			params.add(projectUuid);params.add(customizationId);params.add(projectUuid);params.add(tid);params.add(projectUuid);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND d.customization_id=?");
				params.add(customizationId);
			}
			sql.append(")");
			dao.executeUpdateSQLQuery(sql.toString(), params);
			return true;
		case	3://REC.projectUiid!=VCS_OBJECT .projectUiid for SYNC
			sql.append("select count(1) from iwb.w5_vcs_object v where v.customization_id=? AND v.project_uuid!=? AND v.table_id=? AND v.vcs_object_status_tip in (1,9) AND exists(select 1 from ").append(mt.getDsc())
				.append(" d where d.project_uuid=? AND d.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
			params.add(customizationId);params.add(projectUuid);params.add(tid);params.add(projectUuid);
			if(mt.get_tableParamList().size()>1){
				sql.append(" AND d.customization_id=?");
				params.add(customizationId);
			}
			sql.append(")");
			
			int newCount = GenericUtil.uInt(dao.executeSQLQuery2(sql.toString(), params).get(0));
			if(newCount>0){
				sql.setLength(0);params.clear();
				sql.append("update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.project_uuid!=? AND v.table_id=? AND v.vcs_object_status_tip in (1,9) AND exists(select 1 from ").append(mt.getDsc())
				.append(" d where d.project_uuid=? AND d.").append(mt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
				params.add(projectUuid);params.add(customizationId);params.add(projectUuid);params.add(tid);params.add(projectUuid);
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				dao.executeUpdateSQLQuery(sql.toString(), params);

				vcsClientPushSqlRT(scd, GenericUtil.replaceSql(sql.toString(), params), mt.getDsc() + " (REC.UUID != VCS.UUID 4 SYNC)");
			}
			return true;
		case	4://REC.projectUiid!=DETAIL_REC.projectUiid for INSERT
			if(!GenericUtil.isEmpty(mt.get_tableChildList()))for(W5TableChild tc:mt.get_tableChildList()){
				W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
				if(dt.getTableTip()==0)continue;
				
				sql.setLength(0);params.clear();
				sql.append("update ").append(dt.getDsc()).append(" d set project_uuid=? where d.project_uuid!=? AND exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
					.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
					.append(" m where m.project_uuid=? AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc());
				params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
				if(mt.get_tableParamList().size()>1){
					sql.append(" AND m.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				if(tc.getRelatedStaticTableFieldId()!=0){
					sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
					
				}
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
				
//				List rl = dao.executeSQLQuery2("select "+tc.getRelatedTableId()+" tid, "+dt.get_tableParamList().get(0).getExpressionDsc()+" tpk from "+dt.getDsc()+" d " + sql.toString(), params);
				dao.executeUpdateSQLQuery(sql.toString(), params);

				sql.setLength(0);params.clear();
				sql.append("update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.project_uuid!=? AND v.table_id=? AND v.vcs_object_status_tip=2 AND exists(select 1 from ").append(dt.getDsc())
					.append(" d where d.project_uuid=? AND d.").append(dt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
				params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
				if(dt.get_tableParamList().size()>1){
					sql.append(" AND d.customization_id=?");
					params.add(customizationId);
				}
				sql.append(")");
				dao.executeUpdateSQLQuery(sql.toString(), params);
			}
			return true;
			
		case	5://REC.projectUiid!=DETAIL_REC.projectUiid for SYNC
			if(!GenericUtil.isEmpty(mt.get_tableChildList())){
				for(W5TableChild tc:mt.get_tableChildList()){
					W5Table dt = FrameworkCache.getTable(customizationId, tc.getRelatedTableId());
					if(dt.getTableTip()==0)continue;
					
					sql.append("\n update ").append(dt.getDsc()).append(" d set project_uuid=? where d.project_uuid!=? AND exists(select 1 from iwb.w5_vcs_object v where v.vcs_object_status_tip=2 AND v.customization_id=? AND v.table_id=? AND v.table_pk=d.")
						.append(dt.get_tableParamList().get(0).getExpressionDsc()).append(") AND exists(select 1 from ").append(mt.getDsc())
						.append(" m where m.project_uuid=? AND m.").append(mt.get_tableFieldMap().get(tc.getTableFieldId()).getDsc()).append("=d.").append(dt.get_tableFieldMap().get(tc.getRelatedTableFieldId()).getDsc());
					params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
					if(mt.get_tableParamList().size()>1){
						sql.append(" AND m.customization_id=?");
						params.add(customizationId);
					}
					sql.append(")");
					if(tc.getRelatedStaticTableFieldId()!=0){
						sql.append(" AND d.").append(dt.get_tableFieldMap().get(tc.getRelatedStaticTableFieldId()).getDsc()).append("=").append(tc.getRelatedStaticTableFieldVal());
						
					}
					if(dt.get_tableParamList().size()>1){
						sql.append(" AND d.customization_id=?");
						params.add(customizationId);
					}
					
	//				List rl = dao.executeSQLQuery2("select "+tc.getRelatedTableId()+" tid, "+dt.get_tableParamList().get(0).getExpressionDsc()+" tpk from "+dt.getDsc()+" d " + sql.toString(), params);
	//				dao.executeUpdateSQLQuery(sql.toString(), params);
	
					//params = new ArrayList(); sql = new StringBuilder();
					sql.append(";\n update iwb.w5_vcs_object v set project_uuid=? where v.customization_id=? AND v.project_uuid!=? AND v.table_id=? AND v.vcs_object_status_tip=2 AND exists(select 1 from ").append(dt.getDsc())
						.append(" d where d.project_uuid=? AND d.").append(dt.get_tableParamList().get(0).getExpressionDsc()).append("=v.table_pk");
					params.add(projectUuid);params.add(projectUuid);params.add(customizationId);params.add(tc.getRelatedTableId());params.add(projectUuid);
					if(dt.get_tableParamList().size()>1){
						sql.append(" AND d.customization_id=?");
						params.add(customizationId);
					}
					sql.append(");");
					
				}
				dao.executeUpdateSQLQuery(sql.toString(), params);
				
				vcsClientPushSqlRT(scd, GenericUtil.replaceSql(sql.toString(), params), mt.getDsc() + " (REC.UUID != DETAIL_REC.UUID 4 SYNC)");
			}
			return true;
			
			
		}
		
		return false;		
	}

	public Map vcsClientObjectPullAll(Map<String, Object> scd, int forceStrategy, boolean commitOnException/*0:normal, 1:override conflicts, 2:override all*/) throws JSONException {
		
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","No VCS for this Project", 0, projectUuid, "No VCS for this Project2", null);
		}

		List lm = dao.find("select max(t.vcsCommitId) from W5VcsCommit t where t.projectUuid=?", po.getProjectUuid());
		int lastCommitId = 0;
		W5VcsCommit commit = new W5VcsCommit();
		if(lm.isEmpty() || lm.get(0)==null)lastCommitId = 0;
		else lastCommitId = (Integer)lm.get(0);
		
		String urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&q=2770&l="+lastCommitId;
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		String dbS = HttpUtil.send(url, urlParameters);
		Map<Integer, JSONObject> dbPullMap = new HashMap();
		int startDbCommitId = -1;
		
		if(!GenericUtil.isEmpty(dbS)){
			JSONObject json;
			try {
				json = new JSONObject(dbS);
				if(json.get("success").toString().equals("true")){
					JSONArray ar = json.getJSONArray("data");
					for(int qi=0;qi<ar.length();qi++){
						JSONObject o = ar.getJSONObject(ar.length()-1-qi);
						if(o.has("extra_sql")){
							String extraSql = o.getString("extra_sql");
							if(!GenericUtil.isEmpty(extraSql)){
								//result+=dao.executeUpdateSQLQuery(extraSql);
								dbPullMap.put(o.getInt("vcs_commit_id"), o);
								if(startDbCommitId==-1)startDbCommitId = o.getInt("vcs_commit_id");
	//							continue;
							}
						}
//						dao.saveObject(new W5VcsCommit(o));
					}
				}	else
					throw new IWBException("vcs","vcsClientPullAll(DB):server Error Response", 0, dbS, json.getString("error"), null);

			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientPullAll(DB):JSONException", 0, url, e.getMessage(), e.getCause());
				
			}
		}
		
		
		urlParameters = "u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid();
		url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSObjectsAll";
		String s = HttpUtil.send(url, urlParameters);
		if(!GenericUtil.isEmpty(s)){
			JSONObject json;
			try {
				json = new JSONObject(s);
				if(json.get("success").toString().equals("true")){
					JSONObject srvTables =json.getJSONObject("list");
					List<W5VcsObject> lclObjects = dao.find("from W5VcsObject t where t.projectUuid=? AND t.customizationId=? order by t.tableId, t.tablePk", projectUuid, customizationId) ;
					Map<String, W5VcsObject> srcMap = new HashMap();
					for(W5VcsObject ox:lclObjects){
						srcMap.put(ox.getTableId()+"."+ox.getTablePk(), ox);
					}
					
					Iterator keyz = srvTables.keys();
					W5Table t = null;
					String ssql=null;
					while(keyz.hasNext()){
						int srvTableId = GenericUtil.uInt(keyz.next());
						if(t==null || t.getTableId()!=srvTableId){
							t = FrameworkCache.getTable(customizationId, srvTableId);
//							if(GenericUtil.hasCustomization(t.get_tableParamList()))sql.append(" AND x.customization_id=").append(customizationId);
						}
						if(t.getVcsFlag()==0)continue;
						JSONArray srvObjects = srvTables.getJSONArray(srvTableId+"");
						for(int qi=0;qi<srvObjects.length();qi++){
							JSONObject o = srvObjects.getJSONObject(qi);
							int vcsAction = 0;
							int srvPk = GenericUtil.uInt(o.keys().next());
							int srvCommitId = GenericUtil.uInt(o.getString(srvPk+""));
							String pk = t.getTableId()+"."+srvPk;
							W5VcsObject lclObj = srcMap.get(pk);
							if(lclObj!=null){//server'da ve localde var
								if(srvCommitId<0){ //server'da silinmis, localde hala var
									if(lclObj.getVcsObjectStatusTip()==8){ //localde de silinmis, atla
										srcMap.remove(pk);
										continue;
									}

/*									if(GenericUtil.isEmpty(ll)){//boyle birsey olmamasi lazim normalde ama varsa, duzeltmek lazim
										lclObj.setVcsObjectStatusTip((short)8);
										dao.updateObject(lclObj);
										srcMap.remove(pk);
										continue;
									} */
									vcsAction = lclObj.getVcsObjectStatusTip()==1 ? 3:1;//edit edildiyse, conflict, aksi halde pull(delete)
								} else if(lclObj.getVcsObjectStatusTip()==3){ //localde silinmis, server'da var
//									od[1]=srvCommitId;//server vcsCommitId (+,-)
									vcsAction = lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
								} else if(lclObj.getVcsObjectStatusTip()==1){ //localde edit edilmis
									vcsAction = lclObj.getVcsCommitId()==srvCommitId ? 2:3;//push:conflict
								} else if(lclObj.getVcsObjectStatusTip()==9){ //localde synched, serverda edit edilmis
									if(srvCommitId==lclObj.getVcsCommitId()){
										srcMap.remove(pk);
										continue; //normalde olmasi lazim
									}
									vcsAction = 1;//pull				
								} else {
									vcsAction = 3;//conflict	
								}
							} else { //server'da var, localde yok
								if(srvCommitId<0){ //localde hic yokmus, atla
									srcMap.remove(pk);
									continue;
								}
								vcsAction = 1;//pull				
							}
							srcMap.remove(pk);
							
							if(forceStrategy>0 && vcsAction==3)vcsAction=1;
							else if(forceStrategy==2)vcsAction=1;
							
							if(vcsAction==1){
								if(!dbPullMap.isEmpty() && startDbCommitId!=-1 && srvCommitId>startDbCommitId){
									for(int zi=startDbCommitId;zi<srvCommitId;zi++){
										JSONObject oo = dbPullMap.get(zi);
										if(oo!=null){
											String extraSql = oo.getString("extra_sql");
											dao.executeUpdateSQLQuery(extraSql);
											dao.saveObject(new W5VcsCommit(oo));
										}
										startDbCommitId = zi;
									}
								}
								
								Map resM = vcsClientObjectPull(scd, srvTableId, srvPk, true);
								startDbCommitId = srvCommitId;
							}

						}

					}
					Map m = new HashMap();
					m.put("success", true);
					return m;
				} else
					throw new IWBException("vcs","vcsClientPullAll:server Error Response", 0, s, json.getString("error"), null);
			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientPullAll:JSONException", 0, url, e.getMessage(), e.getCause());
				
			}
		}
		throw new IWBException("vcs","vcsClientPullAll", 0, url, "No Response from VCS Server2", null);
		
	}

	public Map vcsClientLocaleMsgSynch(Map<String, Object> scd) throws JSONException {
		int customizationId = (Integer)scd.get("customizationId");
		String projectUuid = (String)scd.get("projectId");
		W5Project po = FrameworkCache.wProjects.get(projectUuid);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsClientLocaleMsgSynch", 0, projectUuid, "No VCS for this Project2", null);
		}

		List lvlmd = dao.executeSQLQuery("select x.val from iwb.w5_app_setting x where x.customization_id=? AND x.dsc='vcs_locale_msg_dttm'", customizationId);
		String vlmd = "20170101";
		if(!GenericUtil.isEmpty(lvlmd)){
			vlmd = (String)lvlmd.get(0);
			dao.executeUpdateSQLQuery("update iwb.w5_app_setting set val=to_char(current_date,'yyyymmdd'), version_no=version_no+1, version_dttm=current_timestamp, version_user_id=? where customization_id=? AND dsc='vcs_locale_msg_dttm'", scd.get("userId"), customizationId);
		} else {
			dao.executeUpdateSQLQuery("INSERT INTO iwb.w5_app_setting(dsc, customization_id, setting_tip, locale_msg_key, val, control_tip, not_null_flag, tab_order, control_width) "
					+ "VALUES ('vcs_locale_msg_dttm', ?, 2, 'vcs_locale_msg_dttm', to_char(current_date,'yyyymmdd'), 1, 1, 55, 150)", customizationId);
		}
		
		Map m = new HashMap();
		m.put("success", true);
		
		String urlParameters = "q=2800&u="+po.getVcsUserName()+"&p="+po.getVcsPassword()+"&c="+customizationId+"&r="+po.getProjectUuid()+"&l="+vlmd;
		String url=po.getVcsUrl();
		if(!url.endsWith("/"))url+="/";
		url+="serverVCSQueryResult";
		String dbS = HttpUtil.send(url, urlParameters);
		List<Object[]> toPush = new ArrayList();
		
		if(!GenericUtil.isEmpty(dbS)){
			JSONObject json;
			try {
				json = new JSONObject(dbS);
				if(json.get("success").toString().equals("true")){
					Map requestParams = new HashMap(); requestParams.put("l", vlmd);
					W5QueryResult qr = dao.executeQuery(scd, 2800, requestParams);
					Map<String, Object[]> lclMap = new HashMap();
					if(!GenericUtil.isEmpty(qr.getData()))for(Object[] o:qr.getData()){
						lclMap.put((String)o[0], o);
					}

					JSONArray ar = json.getJSONArray("data");
					for(int qi=0;qi<ar.length();qi++){
						JSONObject o = ar.getJSONObject(qi);
						String lmk = o.getString("k");
						Object[] lo = lclMap.get(lmk);
						List<String> vx = null;
						if(lo!=null || (vx=dao.executeSQLQuery("select x.dsc from iwb.w5_locale_msg x where x.customization_id=? AND x.locale=? AND x.locale_msg_key=?", customizationId, lmk.substring(0,2), lmk.substring(2)))!=null){ //demek iki yerde de var
							String lmv = o.getString("v");
							if(!lmv.equals(vx==null ? (String)lo[1] : vx.get(0))){ //farkli ise
								String lmt = o.getString("t");
								if(vx!=null || lmt.compareTo((String)lo[2])>0){
									String lcl = lmk.substring(0,2);
									String key = lmk.substring(2);
									dao.executeUpdateSQLQuery("update iwb.w5_locale_msg set dsc=?, version_no=version_no+1, version_dttm=to_timestamp(?,'yymmddhh24miss'), version_user_id=? where customization_id=? AND locale=? AND locale_msg_key=?", lmv, lmt, o.getInt("u"), customizationId, lcl, key);
								} else {
									lo[3]=1;
									toPush.add(lo);
								}
							}
							lclMap.remove(lmk);
						} else { //insert edilecek local
							String lcl = lmk.substring(0,2);
							String key = lmk.substring(2);
							dao.executeUpdateSQLQuery("INSERT INTO iwb.w5_locale_msg(locale, locale_msg_key, dsc, version_no, version_user_id, version_dttm, insert_user_id, insert_dttm, publish_flag, customizabled_flag, customization_id, project_uuid) "
									+ " VALUES (?, ?, ?, 1, ?, current_timestamp, ?, to_timestamp(?,'yymmddhh24miss'), 0, 1, ?, ?)", lcl, key, o.get("v"), o.getInt("u"), o.getInt("u"), o.getString("t"), customizationId, projectUuid);
						}
						
						
//						dao.saveObject(new W5VcsCommit(o));
					}
					
					for(Object[] lo:lclMap.values()){
						lo[3]=2;
						toPush.add(lo);
					}
					
					if(!toPush.isEmpty()){
						JSONArray data = new JSONArray();
						for(Object[] o:toPush){
							JSONObject jo = new JSONObject();
							jo.put("l", ((String)o[0]).substring(0, 2));
							jo.put("k", ((String)o[0]).substring(2));
							jo.put("v", o[1]);
							jo.put("t", o[2]);
							jo.put("a", o[3]);
							data.put(jo);
						}
						JSONObject params = new JSONObject(); 
						
						params.put("u", po.getVcsUserName());
						params.put("p", po.getVcsPassword());params.put("c", 0);params.put("r", po.getProjectUuid());
						params.put("objects", data);
						url=po.getVcsUrl();//"http://localhost:8080/q1/app/";//
						if(!url.endsWith("/"))url+="/";
						url+="serverVCSLocaleMsgPushAll";
						String s = HttpUtil.sendJson(url, params);
						if(!GenericUtil.isEmpty(s)){
							JSONObject json2;
							try {
								json2 = new JSONObject(s);
								if(!json2.get("success").toString().equals("true")){
								//	throw new PromisException("vcs","vcsClientLocaleMsgSynch:server Error Response", 0, s, json2.getString("error"), null);
									m.put("outMsg", "SERVER ERROR: "+json2.getString("error"));

								}
							} catch (JSONException e){
								throw new IWBException("vcs","vcsClientLocaleMsgSynch:JSONException", 0, s, e.getMessage(), e.getCause());
							}
						}
						else
							throw new IWBException("vcs","vcsClientLocaleMsgSynch:Server no Response", 0, s, "Server no Response", null);

					}
								
/*					
					String lcl = lmk.substring(0,2);
					String key = lmk.substring(2);
*/
				}	else
					throw new IWBException("vcs","vcsClientLocaleMsgSynch:server Error Response", 0, dbS, json.getString("error"), null);

			} catch (JSONException e){
				throw new IWBException("vcs","vcsClientLocaleMsgSynch:JSONException", 0, url, e.getMessage(), e.getCause());
				
			}
		}

		return m;
		
	}
	synchronized public int vcsServerLocaleMsgPushAll(String userName, String passWord, int customizationId, String projectId, JSONArray ja) throws JSONException {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerLocaleMsgPushAll",0,null, "Not a VCS Server to vcsServerLocaleMsgPushAll", null);
		Map scd = vcsServerAuthenticate(userName, passWord, customizationId, projectId);
		W5Project po = FrameworkCache.wProjects.get(projectId);
		if(po.getVcsFlag()==0){
			throw new IWBException("vcs","vcsServerLocaleMsgPushAll", 0, projectId, "No VCS for this Project2", null);
		}
		int userId = (Integer)scd.get("userId");
		for(int qi=0;qi<ja.length();qi++){
			JSONObject o = ja.getJSONObject(qi);
			String lcl = o.getString("l");
			String key = o.getString("k");
			String val = o.getString("v");
			String tm = o.getString("t");
			if(GenericUtil.uInt(dao.executeSQLQuery("select count(1) from iwb.w5_locale_msg where locale=? AND locale_msg_key=?", lcl, key).get(0))==0)
				dao.executeUpdateSQLQuery("INSERT INTO iwb.w5_locale_msg(locale, locale_msg_key, dsc, version_no, version_user_id, version_dttm, insert_user_id, insert_dttm, publish_flag, customizabled_flag, customization_id, project_uuid) "
						+ " VALUES (?, ?, ?, 1, ?, current_timestamp, ?, to_timestamp(?,'yymmddhh24miss'), 0, 1, ?, ?)", lcl, key, val, userId, userId, tm, customizationId, projectId);
			else
				dao.executeUpdateSQLQuery("update iwb.w5_locale_msg set dsc=?, version_no=version_no+1, version_dttm=to_timestamp(?,'yymmddhh24miss'), version_user_id=? where customization_id=? AND locale=? AND locale_msg_key=?", val, tm, userId, customizationId, lcl, key);
			

		}

		return ja.length();
	}


	public Map vcsServerTenantCheck(int socialCon, String email, String nickName, String socialNet) {
		if(!FrameworkSetting.vcsServer)
			throw new IWBException("vcs","vcsServerObjectPull",0,null, "Not a VCS Server to vcsServerObjectPull", null);
		List<Object[]> list = dao.executeSQLQuery("select u.customization_id, u.user_id from iwb.w5_user u  where u.email=? AND u.lkp_auth_external_source=?",email,socialCon);
		Map map = new HashMap();
		if(!GenericUtil.isEmpty(list)){
			Object[] obj = list.get(0);
			int cusId = GenericUtil.uInt(obj[0]);
			
			map.put("customizationId", cusId);
			map.put("userId", obj[1]);
			//List eparams = new ArrayList(); eparams.add(email);
			//List<Map> userList = dao.executeSQLQuery2Map("select t.* from iwb.w5_user t where t.email=?", eparams);
			//map.put("userList",userList);
			List params = new ArrayList(); params.add(cusId);
			List<Map> projectList = dao.executeSQLQuery2Map("select p.* from iwb.w5_project p where p.customization_id=?", params);
			map.put("projects", projectList);
			List<Map> tList = dao.executeSQLQuery2Map("select t.* from iwb.w5_user_tip t where t.customization_id=?", params);
			map.put("userTips", tList);
		} else {
			int cusId = GenericUtil.getGlobalNextval("seq_customization");
			dao.executeUpdateSQLQuery("insert into iwb.w5_customization(customization_id, dsc, sub_domain) values (?,?,?)", cusId, socialNet, nickName);
			
			String projectId = UUID.randomUUID().toString();
			String schema = "c"+GenericUtil.lPad(cusId+"", 5, '0')+"_"+projectId.replace('-', '_');
			int userId = GenericUtil.getGlobalNextval("seq_user");

			String vcsUrl = FrameworkCache.getAppSettingStringValue(0, "vcs_url_new_project");
			dao.executeUpdateSQLQuery("insert into iwb.w5_project(project_uuid, customization_id, dsc, access_users, set_search_path_flag, rdbms_schema, vcs_flag, vcs_url, vcs_user_name, vcs_password)"
					+ " values (?,?,?, ?, 1, ?,1,?,?,iwb.md5hash(?))", projectId, cusId, "New Project 1", ""+userId,schema,vcsUrl,nickName, nickName+1);
			dao.executeUpdateSQLQuery("create schema "+schema + " AUTHORIZATION iwb");
			int userTip = GenericUtil.getGlobalNextval("seq_user_tip");
			dao.executeUpdateSQLQuery("insert into iwb.w5_user_tip(user_tip, dsc, customization_id, project_uuid, web_frontend_tip, default_main_template_id) values (?,?,?, ?, 1, 1145)", userTip, "Role Group 1", cusId, projectId);
			
			dao.executeUpdateSQLQuery("insert into iwb.w5_role(role_id, customization_id, dsc, user_tip, project_uuid) values (0,?,?,?,?)", cusId, "Role 1", userTip, projectId);
			
			dao.executeUpdateSQLQuery("insert into iwb.w5_user(user_id, customization_id, user_name, email, pass_word, user_status, dsc,login_rule_id, lkp_auth_external_source, auth_external_id, project_uuid) values (?,?,?,?,iwb.md5hash(?),?,?,?,?,?,?)", 

					userId, cusId, nickName, email, nickName+1, 1, nickName, 1 , socialCon, email,projectId);
			int userRoleId = GenericUtil.getGlobalNextval("seq_user_role");
			dao.executeUpdateSQLQuery("insert into iwb.w5_user_role(user_role_id, user_id, role_id, customization_id,unit_id, project_uuid) values(?, ?, 0, ?,?, ?)",userRoleId, userId, cusId,0,projectId);

			
			map.put("projectList", false);
			map.put("customizationId", cusId);
			map.put("userId", userId);
			List params = new ArrayList(); params.add(cusId);
			List<Map> projectList = dao.executeSQLQuery2Map("select p.* from iwb.w5_project p where p.customization_id=?", params);
			map.put("projects", projectList);
			List<Map> tList = dao.executeSQLQuery2Map("select t.* from iwb.w5_user_tip t where t.customization_id=?", params);
			map.put("userTips", tList);
			
			FrameworkSetting.customizationSystemStatus.put(cusId, 0);
			FrameworkCache.wCustomizationMap.put(cusId, (W5Customization)dao.find("from W5Customization t where t.customizationId=?", cusId).get(0));
			FrameworkCache.wProjects.put(projectId, (W5Project)dao.find("from W5Project t where t.customizationId=? AND t.projectUuid=?", cusId, projectId).get(0));
			//Map cache = FrameworkCache.reloadCacheQueue();
		}
		return map;
	}

}
