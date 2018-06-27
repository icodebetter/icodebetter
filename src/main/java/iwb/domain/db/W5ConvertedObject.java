package iwb.domain.db;

import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Immutable;

import iwb.domain.helper.W5TableRecordHelper;

// Generated Jun 17, 2007 5:12:14 PM by Hibernate Tools 3.2.0.b9


@Entity
@Immutable
@Table(name="w5_converted_object",schema="iwb")
public class W5ConvertedObject implements java.io.Serializable {

	public W5ConvertedObject() {
		super();
	}
	private int convertedObjectId;
	private int conversionId;
	private int customizationId;
	private int srcTablePk;
	private int dstTablePk;
	private int versionNo;
	private int insertUserId;
	private int versionUserId;
//	private int groupId;
	private String dstDetailTableIds;
	private	List<W5TableRecordHelper> _relatedRecord;
	
    @SequenceGenerator(name="sex_converted_object",sequenceName="seq_converted_object",allocationSize=1)
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="sex_converted_object")
	@Column(name="converted_object_id")
	public int getConvertedObjectId() {
		return convertedObjectId;
	}
	public void setConvertedObjectId(int convertedObjectId) {
		this.convertedObjectId = convertedObjectId;
	}
	
	@Column(name="conversion_id")
	public int getConversionId() {
		return conversionId;
	}
	public void setConversionId(int conversionId) {
		this.conversionId = conversionId;
	}
	
	@Column(name="src_table_pk")
	public int getSrcTablePk() {
		return srcTablePk;
	}
	public void setSrcTablePk(int srcTablePk) {
		this.srcTablePk = srcTablePk;
	}
	
	@Column(name="dst_table_pk")
	public int getDstTablePk() {
		return dstTablePk;
	}
	public void setDstTablePk(int dstTablePk) {
		this.dstTablePk = dstTablePk;
	}
	@Id
	@Column(name="customization_id")
	public int getCustomizationId() {
		return customizationId;
	}
	public void setCustomizationId(int customizationId) {
		this.customizationId = customizationId;
	}

	@Column(name="version_no")
	public int getVersionNo() {
		return versionNo;
	}
	public void setVersionNo(int versionNo) {
		this.versionNo = versionNo;
	}
	@Column(name="insert_user_id")
	public int getInsertUserId() {
		return insertUserId;
	}
	public void setInsertUserId(int insertUserId) {
		this.insertUserId = insertUserId;
	}
	@Column(name="version_user_id")
	public int getVersionUserId() {
		return versionUserId;
	}
	public void setVersionUserId(int versionUserId) {
		this.versionUserId = versionUserId;
	}
	public W5ConvertedObject(Map<String, Object> scd, int conversionId, int srcTablePk, int dstTablePk/*, int groupId*/, String dstDetailTableIds) {
		super();
		this.versionNo = 1;
		this.versionUserId = (Integer)scd.get("userId");
		this.insertUserId = (Integer)scd.get("userId");
		this.customizationId = (Integer)scd.get("customizationId");
		this.conversionId = conversionId;
		this.srcTablePk = srcTablePk;
		this.dstTablePk = dstTablePk;
		this.dstDetailTableIds = dstDetailTableIds;
//		this.groupId = groupId;
	}
	@Transient
	public List<W5TableRecordHelper> get_relatedRecord() {
		return _relatedRecord;
	}
	public void set_relatedRecord(List<W5TableRecordHelper> _relatedRecord) {
		this._relatedRecord = _relatedRecord;
	}
/*	@Column(name="group_id")
	public int getGroupId() {
		return groupId;
	}
	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}*/
	@Column(name="dst_detail_table_ids")
	public String getDstDetailTableIds() {
		return dstDetailTableIds;
	}
	public void setDstDetailTableIds(String dstDetailTableIds) {
		this.dstDetailTableIds = dstDetailTableIds;
	}
	
	
	
}
