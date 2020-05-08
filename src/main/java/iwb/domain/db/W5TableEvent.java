package iwb.domain.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Immutable;


// Generated Feb 25, 2007 1:41:05 PM by Hibernate Tools 3.2.0.b9

/**
 * WDbFunc generated by hbm2java
 */
@Entity
@Immutable
@Table(name="w5_table_trigger",schema="iwb")
public class W5TableEvent implements java.io.Serializable, W5Base {
/*TABLE_ID: 1209*/

	
	private static final long serialVersionUID = 1444443444L;
	private int tableTriggerId;
	private int tableId;
	private String triggerCode;
	private String dsc;
	private short lkpCodeType;
	private short activeFlag;
	private short tabOrder;
	private String lkpTriggerActions;
	private short lkpResultAction;
	
	@Id
	@Column(name="table_trigger_id")
	public int getTableTriggerId() {
		return tableTriggerId;
	}
	public void setTableTriggerId(int tableChildId) {
		this.tableTriggerId = tableChildId;
	}

	@Column(name="table_id")
	public int getTableId() {
		return tableId;
	}
	public void setTableId(int tableId) {
		this.tableId = tableId;
	}
	@Column(name="trigger_code")
	public String getTriggerCode() {
		return triggerCode;
	}
	public void setTriggerCode(String triggerCode) {
		this.triggerCode = triggerCode;
	}
	
	@Column(name="lkp_result_action")
	public short getLkpResultAction() {
		return lkpResultAction;
	}
	public void setLkpResultAction(short lkpResultAction) {
		this.lkpResultAction = lkpResultAction;
	}
	@Column(name="lkp_trigger_actions")
	public String getLkpTriggerActions() {
		return lkpTriggerActions;
	}
	public void setLkpTriggerActions(String lkpTriggerActions) {
		this.lkpTriggerActions = lkpTriggerActions;
	}
	@Column(name="tab_order")
	public short getTabOrder() {
		return tabOrder;
	}
	public void setTabOrder(short tabOrder) {
		this.tabOrder = tabOrder;
	}
	@Column(name="active_flag")
	public short getActiveFlag() {
		return activeFlag;
	}
	public void setActiveFlag(short activeFlag) {
		this.activeFlag = activeFlag;
	}
	
	@Column(name="lkp_code_type")
	public short getLkpCodeType() {
		return lkpCodeType;
	}
	public void setLkpCodeType(short lkpCodeType) {
		this.lkpCodeType = lkpCodeType;
	}
	@Column(name="dsc")
	public String getDsc() {
		return dsc;
	}
	public void setDsc(String dsc) {
		this.dsc = dsc;
	}
	
	private String projectUuid;
	@Id	
	@Column(name="project_uuid")
	public String getProjectUuid() {
		return projectUuid;
	}

	public void setProjectUuid(String projectUuid) {
		this.projectUuid = projectUuid;
	}

	public boolean equals(Object o) {
		if(o==null || !(o instanceof W5TableEvent))return false;
		W5TableEvent c = (W5TableEvent)o;
		return c!=null && c.getTableTriggerId()==tableTriggerId && c.getProjectUuid().equals(projectUuid);
	}
	
	public int hashCode() {
		return projectUuid.hashCode() + 100*tableTriggerId;
	}
	

	@Transient
	public boolean safeEquals(W5Base q) {

			return false;
	}
}
