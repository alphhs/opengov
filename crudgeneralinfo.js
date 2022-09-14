import React, { useState, useEffect, useRef } from "react";
import DataGrid, {
    Column,
    Editing,
    Grouping,
    Popup as DataGridPopup,
    
    Selection, Button as ActionButton, GroupPanel, Scrolling, HeaderFilter,
} from "devextreme-react/data-grid";
import {
    Item,
    ButtonItem,
    PatternRule,
    Lookup,
    SearchPanel,
    RequiredRule as RequiredRuleForm,
} from "devextreme-react/form";
import { TreeList } from "devextreme-react";
import List from "devextreme-react/list";
import ArrayStore from "devextreme/data/array_store";
import FileServices from "../../../services/api/file";
import { Template } from "devextreme-react/core/template";
import { Popup } from "devextreme-react/popup";
import docImage from "../../../assets/imgs/law-component-document.svg";
import notify from "devextreme/ui/notify";
import FileUploader from "devextreme-react/file-uploader";
import OgLoader from "../../../util/OgLoader";
import crudService from "../../../services/api/news";
import DataSource from 'devextreme/data/data_source';
import _ from "lodash";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/data-grid";
import ScrollView from "devextreme-react/scroll-view";
import OrganizationService from "../../../services/api/organization";
import lawServices from "../../../services/api/law";


import DropDownButton from 'devextreme-react/drop-down-button'

import Form, {
    GroupItem,
    Item as FormItem,
    Label,
    RequiredRule,
  } from "devextreme-react/form";
  import SelectBox from 'devextreme-react/select-box';
  import TextArea from 'devextreme-react/text-area';
  import HtmlEditor, {
    MediaResizing,
    Toolbar,
  } from "devextreme-react/html-editor";
  import { CheckBox } from 'devextreme-react/check-box';
  import TextBox from 'devextreme-react/text-box';
  import {Button as DevExtremeButton} from "devextreme-react/button";
  
  let whatwe = "";
  let whowe= "";
  let howwe= ""
  let ourHis= ""

//Main High Order Component for landing section news text context, CRUD control dashboard.
//add dependency array on row ID change
const CrudGeneralInfo2 = () => {
    const [crudData, setCrudData] = useState([]);
    const [popUpModal, setPopUpModal] = useState(false);
    const [newsObj, setNewsObject] = useState({});
    const [currentSelectedRow, setCurrentSelectedRow] = useState({});
    const [popUpId, setPopUpId] = useState(0);
    const [childData, setChildData] = useState([]);
    const [branchListData, setBranchData] = useState([]);
    const [policyDesc, setPolicyDesc] = useState([]);
    const [parentOrgs, setParentOrgs]= useState([]);
    const [childOrgs, setChildOrgs]= useState([])
    const [selectedParent, setSelectedParent]= useState(null)
    const [selectedChild, setSelectedChild]= useState(null)
    const [img, setImg] = useState([]);
    const [selectedOrg, setSelectedOrg]= useState(null)
    

    useEffect(()=>{
      const fetchData= async()=>{
          await getParentOrgs()
          // await getChildOrgs(278)
      }
      fetchData()
    },[])
    useEffect(()=>{
      const fetchData= async()=>{
          // await getParentOrgs()
          await getChildOrgs(selectedParent)
      }
      fetchData()
    },[selectedParent])

    const getParentOrgs= async()=>{
      const Orgs= await OrganizationService.getParentOrgs()
      setParentOrgs(Orgs.data)
      console.log("parent orgs",parentOrgs)
    }
    const getChildOrgs= async(org_id)=>{
      const childOrgs= await OrganizationService.getChildOrgs(org_id)
      setChildOrgs(childOrgs.data)
      console.log("child orgs",childOrgs.data)
  
    }

    
    

    //function to flatten json into datasource mappable format
  







    const onShowingTreelist = () => {
        // console.log("popup onshown event is triggered...");
        // console.log("type of state is : " + typeof currentSelectedRow);
        // console.log("Current selected state is : " + JSON.stringify(currentSelectedRow));
       
    };

    
   
    const hideInfo = () => {

        setPopUpModal(false);
        console.log(currentSelectedRow);
        console.log(childData);
        setCurrentSelectedRow({});
        setChildData([]);

        console.log(branchListData);
    };
    const whatWeDoRef = useRef();
    const howWeDoRef= useRef();
    const whoWeAreRef = useRef();
    const ourHistoryRef= useRef()
    const [visible, setVisible] = useState(false);
    const formRef = useRef(null);
    const [isLoading, setIsLoading]= useState(false)
    const [addNewsFormToggler, setAddNewsFormToggler]= useState(false)
    const [Toggler, setToggler]= useState(false)
  
  
    const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
    
    const fontValues = [
      "Arial",
      "Courier New",
      "Georgia",
      "Impact",
      "Lucida Console",
      "Tahoma",
      "Times New Roman",
      "Verdana",
    ];
  
    const sizeOptions = { placeholder: "Хэмжээ" };
  
    const fontOptions = { placeholder: "Фонт" };

  
   
    const titleOptions = { placeholder: "Нийтлэлийн гарчиг" };
    const textOptions = { height: 90, placeholder: "Нийтлэлийн тайлбар..." };
    const buttonOptions = {
        
        method: "submit",
        type: "success",
        useSubmitBehavior: true,
      };
     

    const cleanForm = ()=> {
      formRef.current.instance.resetValues();
      whatWeDoRef.current.instance.resetValues()
      howWeDoRef.current.instance.resetValues();
      whoWeAreRef.current.instance.resetValues();
      ourHistoryRef.current.instance.resetValues()
  };

  const submitBanner= async ()=>{
    try {
        let data= new FormData()
        data.append("image", img[0])
        const res= await FileServices.uploadBannerPicture(data)
        return res.data
    } catch (error) {
        
    }
}
const cellTemp = (cellElement, cellInfo) => {
  return cellElement.append(cellInfo.row.loadIndex + 1);
}

  const submitHandler = async (e) => {
        e.preventDefault();
        setVisible(true);
        console.log("selectedChild", selectedChild)
        console.log("selectedParent", selectedParent)
        if (img.length === 0) return notify("Зураг оруулна уу!", "warning", 3000);

        // newsObj.file_id= await submitBanner();
        newsObj.org_id= selectedChild !=="" ? selectedChild : selectedParent
        newsObj.whatwe= whatwe;
        newsObj.whowe= whowe;
        newsObj.howwe= howwe;
        newsObj.ourHis= ourHis;
        console.log("NewsObj",newsObj)
        cleanForm()
        
        try {
          
          
          // const result = await newsServices.addNews(newsObj);
          // setVisible(false);
          // if (result.code === 200) {
          //   await cleanForm(result);
          // } else {
          //   setVisible(false);
          //   return notify(result.message, "warning", 4000);
          // }
        } catch (e) {
          // setVisible(false);
          // console.log(e, " - > error");
          // return notify("Хадгалах үйлдэл амжилтгүй боллоо!", "warning", 4000);
        }
  };
    
      const whatWeDo = (e) => {
        whatWeDoRef.current = e.value;
        whatwe = e.value;
      };
      const whoWeAre = (e) => {
        whoWeAreRef.current = e.value;
        whowe = e.value;
      };
      const howWeDo= (e)=>{
        howWeDoRef.current= e.value;
        howwe= e.value
      }
      const ourHistory=(e)=>{
        ourHistoryRef.current= e.value
        ourHis= e.value
      }
      const handleParentOrg= (e)=>{
        setSelectedParent(e.value.org_id)
      }

      const handleChildOrg=(e)=>{
        setSelectedChild(e.value.id)
        console.log("handleChildOrg", selectedChild)
      }
      const handleImg=(e)=>{
        setImg(e.value)
    }

    return (
        

        <div>
            <DataGrid dataSource={parentOrgs} 
            showBorders={true}
           keyExpr="org_id"
            allowColumnReordering={true}
          columnAutoWidth={true}
        showColumnLines={false}
        width="100%"
        showRowLines={true}
        hoverStateEnabled={true}>
            <Grouping autoExpandAll={false} />
            <Selection mode="single" />
            {/* <GroupPanel visible={true}/> */}
            <HeaderFilter visible={true} />
            <Scrolling mode="virtual"/>
            <Editing
                                    allowUpdating={true}
                                    allowDeleting={true}
                                    mode="row" />
            <Column caption="№"  allowSorting={false} cellTemplate={cellTemp} alignment="center" width={30}/>
            <Column caption="Ерөнхий байгууллагууд"  dataField="name" ></Column>
            <Column caption="Үйлдэл"  type="buttons">
                                    <Button name="edi" text="Оруулах"  onClick={(e)=>{setPopUpModal(true); setSelectedOrg(e.row.key); console.log(e)}}/>
                                    <Button name="delet" text="Засах" onClick={() => setAddNewsFormToggler(true)}/>
            </Column>

            </DataGrid>
            
            <Popup 
            visible={addNewsFormToggler} 
            closeOnOutsideClick={true} 
            dragEnabled={false}
            showCloseButton={false}
            showTitle={true}
            onHiding={()=>setAddNewsFormToggler(false)}>

            <ScrollView height="100%" width="100%">
        
         <h1 className="html-editor-title">Ерөнхий мэдээлэл</h1>
          <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Ерөнхий газар:</div>
            <div className="dx-field-value">
              <SelectBox items={parentOrgs}
              displayExpr="name"
                placeholder="ЦЕГ"
                showClearButton={true} />
            </div>
          </div>
          </div>
          <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Байгууллага:</div>
            <div className="dx-field-value">
              <SelectBox 
              items={childOrgs}
              displayExpr="name"
                placeholder="Архангай аймгийн цагдаагийн газар"
                showClearButton={true} />
            </div>
          </div>
          </div>
          <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea  height={200} className="dx-field-value" defaultValue="bla bla" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="bla bla" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="bla blass" />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
          <div className="dx-field-label">Бид юу хийдэг вэ?</div>
            <TextArea height={200} className="dx-field-value" defaultValue="424 N Main St." />
          </div>
          <div className="dx-field">
          <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
          <CheckBox defaultValue={false} />
          </div>
        </div>
        <div className="dx-fieldset">
        <div className="dx-field">

            <div className="dx-field-label">Оруулсан файлууд:</div>
         
            <DataGrid dataSource={parentOrgs} showBorders={false}
            >
            <Editing
              allowUpdating={true}
              allowDeleting={true}
              mode="row"
              texts={{
               confirmDeleteMessage: 'Энэ мэдээллийг устгах уу?',
               confirmDeleteTitle: 'Баталгаажуулах',
              deleteRow: 'Устгах',
              editRow: 'Өөрчлөх',
              saveRowChanges: 'Хадгалах',
              undeleteRow: 'Буцаах',
              validationCanceChanges: 'Баталгаажуулах болих',
                                    }}
                                     />
                <Column caption="Файлын нэр" datafield='Websit'></Column>
                <Column caption="Файлын төрөл" dataType='Websit'></Column>
                <Column caption="Үйлдэл" type="buttons">
                                    <Button  text="Устгах" name='delete' />
                                    <Button  text="Өөрчлөх" onClick={() => setToggler(true)}/>
                                </Column>
                {/* <Template name="customCellTemplat" render={renderCel} /> */}
            </DataGrid>
            </div>
            </div>
            
          

        </ScrollView>

      </Popup>
      <Popup 
      visible={Toggler} 
  closeOnOutsideClick={true} 
onHiding={()=>setToggler(false)}
width={300}           
          height={300}>

        <ScrollView height="80%" width="100%">
        
        <div className="row">
            <div className="dx-field-label">Файл хуулах:</div>
            
            <FileUploader
            multiple=""
            accept=""
            uploadMode=""
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
            onValueChanged="" />
           
            </div>
            <div className="row">
            <DevExtremeButton 
                  width={120}
                  text="Хадгалах"
                  type="normal"
                  buttonOptions={buttonOptions}
                  stylingMode="contained"
                  style={{position: 'absolute',}}
                />
            
            </div>
        </ScrollView>

      </Popup>
      <Popup
          visible={popUpModal}
          onShowing={onShowingTreelist}
          onHiding={hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showCloseButton={false}
          showTitle={true}
          title="Дэлгэрэнгүй мэдээлэл"
      >
        <ScrollView height="97%" width="100%">
        <form onSubmit={submitHandler} className="form-container">
          {/* <Form  formData={newsObj} ref={formRef}> */}
            <h1 className="html-editor-title">Ерөнхий мэдээлэл</h1>
            <div className="dx-field">
              <div className="dx-field-label">Ерөнхий газар:</div>
              <div className="dx-field-value">
                <SelectBox 
                onValueChanged={handleParentOrg}
                dataSource={parentOrgs}
                displayExpr="name"
                  placeholder="Ерөнхий газар сонгох"
                  showClearButton={true} />
              </div>
            </div>
          
            <div className="dx-field">
              <div className="dx-field-label">Байгууллага:</div>
              <div className="dx-field-value">
                <SelectBox 
                  dataSource={childOrgs}
                  noDataText="Байгууллага байхгүй байна"
                  onValueChanged={handleChildOrg}
                  
                  displayExpr="name"
                  placeholder="Байгууллага сонгох"
                  showClearButton={true} />
              </div>
            </div>
            <div className="row">
              <div className="dx-field-label">Бид юу хийдэг вэ?:</div>
              <div className="dx-field-value">
                <HtmlEditor
                      onValueChanged={whatWeDo}
                      ref={whatWeDoRef}
                  >
                    <MediaResizing enabled={true} />
                    <Toolbar>
                      <Item name="undo" />
                      <Item name="separator" />
                      <Item name="redo" />
                      <Item name="separator" />
                      <Item
                          name="size"
                          acceptedValues={sizeValues}
                          options={sizeOptions}
                      />
                      <Item name="separator" />
                      <Item
                          name="font"
                          acceptedValues={fontValues}
                          options={fontOptions}
                      />
                      <Item name="separator" />
                      <Item name="bold" />
                      <Item name="italic" />
                      <Item name="strike" />
                      <Item name="underline" />
                      <Item name="separator" />
                      <Item name="alignLeft" />
                      <Item name="alignCenter" />
                      <Item name="alignRight" />
                      <Item name="alignJustify" />
                      <Item name="separator" />
                      <Item name="orderedList" />
                      <Item name="bulletList" />
                      <Item name="separator" />
                      <Item name="separator" />
                      <Item name="link" />
                      <Item name="separator" />
                    </Toolbar>
                  </HtmlEditor>
                </div>
              </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>

            <div className="row">
              <div className="dx-field-label">Бид хэн бэ?:</div>
              <div className="dx-field-value">
                <HtmlEditor
                      onValueChanged={whoWeAre}
                      ref={whoWeAreRef}
                      defaultValue=""
                  >
                    <MediaResizing enabled={true} />
                    <Toolbar>
                      <Item name="undo" />
                      <Item name="separator" />
                      <Item name="redo" />
                      <Item name="separator" />
                      <Item
                          name="size"
                          acceptedValues={sizeValues}
                          options={sizeOptions}
                      />
                      <Item name="separator" />
                      <Item
                          name="font"
                          acceptedValues={fontValues}
                          options={fontOptions}
                      />
                      <Item name="separator" />
                      <Item name="bold" />
                      <Item name="italic" />
                      <Item name="strike" />
                      <Item name="underline" />
                      <Item name="separator" />
                      <Item name="alignLeft" />
                      <Item name="alignCenter" />
                      <Item name="alignRight" />
                      <Item name="alignJustify" />
                      <Item name="separator" />
                      <Item name="orderedList" />
                      <Item name="bulletList" />
                      <Item name="separator" />
                      <Item name="separator" />
                      <Item name="link" />
                      <Item name="separator" />
                    </Toolbar>
                  </HtmlEditor>
                </div>
              </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>
           

            <div className="row">
            <div className="dx-field-label">Бид хэрхэн ажилладаг вэ?:</div>
          <div className="dx-field-value">
          <HtmlEditor
                onValueChanged={howWeDo}
                ref={howWeDoRef}
            >
              <MediaResizing enabled={true} />
              <Toolbar>
                <Item name="undo" />
                <Item name="separator" />
                <Item name="redo" />
                <Item name="separator" />
                <Item
                    name="size"
                    acceptedValues={sizeValues}
                    options={sizeOptions}
                />
                <Item name="separator" />
                <Item
                    name="font"
                    acceptedValues={fontValues}
                    options={fontOptions}
                />
                <Item name="separator" />
                <Item name="bold" />
                <Item name="italic" />
                <Item name="strike" />
                <Item name="underline" />
                <Item name="separator" />
                <Item name="alignLeft" />
                <Item name="alignCenter" />
                <Item name="alignRight" />
                <Item name="alignJustify" />
                <Item name="separator" />
                <Item name="orderedList" />
                <Item name="bulletList" />
                <Item name="separator" />
                <Item name="separator" />
                <Item name="link" />
                <Item name="separator" />
              </Toolbar>
            </HtmlEditor>
            </div>
            </div>
            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>

            <div className="row">
            <div className="dx-field-label">Бидний түүх:</div>
          <div className="dx-field-value">
          <HtmlEditor
                // height="40px"
                // width='50px'
                onValueChanged={ourHistory}
                ref={ourHistoryRef}
            >
              <MediaResizing enabled={true} />
              <Toolbar>
                <Item name="undo" />
                <Item name="separator" />
                <Item name="redo" />
                <Item name="separator" />
                <Item
                    name="size"
                    acceptedValues={sizeValues}
                    options={sizeOptions}
                />
                <Item name="separator" />
                <Item
                    name="font"
                    acceptedValues={fontValues}
                    options={fontOptions}
                />
                <Item name="separator" />
                <Item name="bold" />
                <Item name="italic" />
                <Item name="strike" />
                <Item name="underline" />
                <Item name="separator" />
                <Item name="alignLeft" />
                <Item name="alignCenter" />
                <Item name="alignRight" />
                <Item name="alignJustify" />
                <Item name="separator" />
                <Item name="orderedList" />
                <Item name="bulletList" />
                <Item name="separator" />
                <Item name="separator" />
                <Item name="link" />
                <Item name="separator" />
              </Toolbar>
            </HtmlEditor>
            </div>
            </div>

            <div className="dx-field">
            <div className="dx-field-label">Олон нийтэд харуулах эсэх:</div>
            <div className="dx-value">
            <CheckBox defaultValue={false} />
            </div>
            </div>
            


            <div className="dx-field">
            <div className="dx-field-label">Баннер оруулах:</div>
            <div className="dx-value">
            <FileUploader
            multiple=""
            accept=""
            uploadMode="useForm"
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
            onValueChanged={handleImg} />
            </div>
            </div>
            <div className="dx-field">
             <div className="dx-field-label">Түүхэн замнал:</div>
             <div className="dx-value">
             <FileUploader
            multiple=""
            accept=""
            uploadMode=""
            uploadUrl=""
            onValueChanged="" />

            </div>
            </div>


            <Button className="news-form-submit-btn" type="submit">Хадгалах</Button>
            {/* </Form> */}
            </form>
            
        
        
        </ScrollView>
            </Popup>
        </div>

    );

};
export default CrudGeneralInfo2;
