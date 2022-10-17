import React, { useContext, useRef, useState, useEffect } from "react";

import { UserContext } from "../../../hooks/UserContext";
import FileServices from "../../../services/api/file";
import newsServices from "../../../services/api/news";

import Form, {
  ButtonItem,
  Item as FormItem,
  SimpleItem,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import { LoadPanel } from "devextreme-react/load-panel";
import DataGrid,{
  Column,
  Editing,
  Pager,Popup as DataGridPopUp,
  Paging,
  Button
}  from 'devextreme-react/data-grid';
import { Popup } from "devextreme-react/popup";
import HtmlEditor, {
  Item,
  MediaResizing,
  Toolbar,
} from "devextreme-react/html-editor";
import FileUploader from "devextreme-react/file-uploader";
import ScrollView from "devextreme-react/scroll-view";
import notify from "devextreme/ui/notify";
import {Button as DevExtremeButton} from "devextreme-react/button";

import "../css/styles.css";
import OgLoader from "../../../util/OgLoader";

let markup = "";

const AddNews = () => {
  const { user } = useContext(UserContext);
  // const {formVisible, setFormVisible, news, getAllNews, setIsLoading} = props;

  const htmlEditorRef = useRef();
  const photoRef= useRef()
  const [img, setImg] = useState([]);
  const [newsObj] = useState({});
  const [visible, setVisible] = useState(false);
  const [text, setText]= useState("")
  const formRef = useRef(null);
  const [isLoading, setIsLoading]= useState(false)
  const [addNewsFormToggler, setAddNewsFormToggler]= useState(false)
  const [toggle, setToggle]= useState(false)
  const [showDetail, setShowDetail]= useState(false)
  const [data, setData]= useState({
    createdAt: "",
    text: "",
    news_text: "",
    news_title: "",
    updatedAt: "",
    file_id: "",
    file_name: "",
  })


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

  const textOptions = { height: 90, placeholder: "Нийтлэлийн тайлбар..." };

  const titleOptions = { placeholder: "Нийтлэлийн гарчиг" };
  const allowedPageSizes= [10,20,50,100]

  const buttonOptions = {
    text: "Мэдээ, мэдээлэл нэмэх",
    method: "submit",
    type: "success",
    useSubmitBehavior: true,
  };
  const [allNews, setAllNews]= useState([])

  const imgChangeHandler = (e) => {
    setImg(e.value);
  };

const onClickEdit= async (e)=>{
  console.log(e)
  // setText( e.row.data.text)
  htmlEditorRef.current= e.row.data.text
  setData(prev=>{
    return {
      ...prev, 
    createdAt: e.row.data.createdAt,
    text: e.row.data.markup,
    news_text: e.row.data.news_text,
    news_title: e.row.data.news_title,
    updatedAt: e.row.data.updatedAt,
    file_id: e.row.data,
    file_name: e.row.data.file,
    }
  })
  setText(e.row.data.markup)
  setToggle(true)
  console.log(data)
}
  const fileSubmit = async () => {
    try {
      let data = new FormData();
      data.append("image", img[0]);
      const config = { width: 700, height: 600 };
      const res = await FileServices.uploadImage(data, config);
      return res.data.id;
    } catch (e) {
      console.log(e);
      return notify("Алдаатай Файл байна!", "warning", 3000);
    }
  };

  const cleanForm = async (result) => {
    formRef.current.instance.resetValues();
    // htmlEditorRef.current.instance.resetValues();
    return notify(result.message, "success", 4000);
  };



  const onSavingEvent= async (e)=>{
    const data= e.changes[0].data
    try {
      await newsServices.updateNewsById(data)
    } catch (error) {
      console.log(error)
    }
  }

  const onRemovingEvent= async (e)=>{
    const id =(e.data.id)
    console.log(id)
    try {
      await newsServices.deleteNewsById(id)
    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setVisible(true);
    if (img.length === 0) return notify("Зураг оруулна уу!", "warning", 3000);

    newsObj.file_id = await fileSubmit();
    newsObj.markup = markup;
    newsObj.created_user_id = user.id;
    newsObj.start_of_ancestry= user.start_of_ancestry

    try {
      const result = await newsServices.addNews(newsObj);
      setVisible(false);
      if (result.code === 200) {
        await cleanForm(result);
      } else {
        setVisible(false);
        return notify(result.message, "warning", 4000);
      }
    } catch (e) {
      setVisible(false);
      console.log(e, " - > error");
      return notify("Хадгалах үйлдэл амжилтгүй боллоо!", "warning", 4000);
    }
  };
  const fileUploadRender = () => {
    return (
      <div style={{}}>
        <FileUploader
                  onValueChanged={imgChangeHandler}
                  selectButtonText="Зураг оруулах"
                  labelText="Нийтлэлийн нүүр зураг оруулна уу."
                  accept="image/*"
                  uploadMode="useForm"
              />
      </div>
    );
  };
  const consoleChange = (e) => {
    htmlEditorRef.current = e.value;
    markup = e.value;
  };

  useEffect(() => {
    
        try {
          setIsLoading(true)
          const getAllNews = async () => {
            const allNewsService = (await newsServices.getAllNews()).reverse();
            setAllNews(allNewsService)
            }
            getAllNews()  
            setIsLoading(false)
        } catch (error) {
          console.log(error)
        }
  }, [visible]);

  const onHtmlEditorChange=(e)=>{
    setText(e.value)
  }

 

  return (
    <React.Fragment>
      <OgLoader
        isLoading={visible}
        position={{ of: "#gridLoad" }}
        message="Түр хүлээнэ үү..."
      />

      <Popup visible={addNewsFormToggler} closeOnOutsideClick={true} onHiding={()=>setAddNewsFormToggler(false)}>
        <ScrollView height="90%" width="100%">
          <form onSubmit={submitHandler} className="form-container">
            <h1 className="html-editor-title">Мэдээ, мэдээлэл нэмэх</h1>

            <Form className="news-form" formData={newsObj} ref={formRef}>
              <FormItem
                  dataField="news_title"
                  isRequired={true}
                  editorOptions={titleOptions}
              >
                <Label text="Гарчиг" />
                <RequiredRule message="Гарчиг оруулна уу!" />
              </FormItem>
              <FormItem
                  dataField="news_text"
                  isRequired={true}
                  editorType="dxTextArea"
                  editorOptions={textOptions}
              >
                <Label text="Тайлбар" />
                <RequiredRule message="Тайлбар оруулна уу!" />
              </FormItem>

              <ButtonItem
                  className="news-form-submit-btn"
                  horizontalAlignment="center"
                  buttonOptions={buttonOptions}
              />
            </Form>

            <div className="file-uploader-container">
              <FileUploader
                  onValueChanged={imgChangeHandler}
                  selectButtonText="Зураг оруулах"
                  labelText="Нийтлэлийн нүүр зураг оруулна уу."
                  accept="image/*"
                  uploadMode="useForm"
              />
            </div>

            <h1 className="html-editor-title">Нийтлэл</h1>

            <HtmlEditor
                height="400px"
                onValueChanged={consoleChange}
                ref={htmlEditorRef}
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
          </form>

        </ScrollView>

      </Popup>
      <Popup
            visible={toggle}
            title={'Мэдээ засах'}
            width= "80%"
            height= "90%"
            onHiding={() => setToggle(false)}
            dragEnabled={true}
            showTitle={true}
            closeOnOutsideClick={true}
          >
          <ScrollView height="100%" width="100%">
          <div className="widget-container">
          <form onSubmit={submitHandler}>
          <Form formData={data} style={{padding: "1rem"}}>
          <FormItem itemType={"group"} colCount={2} colSpan={1}>
          <SimpleItem dataField="createdAt" editorType="dxDateBox" editorOptions={{ placeholder: "Нэр" }}  allowEditing={false} >
            <Label text="Үүсгэсэн огноо"/>
          </SimpleItem>
          <SimpleItem dataField="updatedAt" editorType="dxDateBox" editorOptions={{ placeholder: "Нэр" }}  allowEditing={false} >
            <Label text="Шинэчилсэн огноо"/>
          </SimpleItem>
          </FormItem>
          <FormItem itemType={"group"} colCount={1} colSpan={2}>
          <SimpleItem dataField="news_title" isRequired={true} editorOptions={{ placeholder: "Нэр" }}  >
            <Label text="Гарчиг"/>
          </SimpleItem>
          <SimpleItem dataField="news_text" isRequired={true} editorOptions={{ placeholder: "Нэр" }} >
            <Label text="Дэд гарчиг"/>
          </SimpleItem>
          {/* <SimpleItem dataField="text" isRequired={true} editorType="dxTextArea" editorOptions={{ placeholder: "Нэр", height: "10rem" }} >
            <Label text="Нийтлэл"/>
          </SimpleItem> */}
          <SimpleItem dataField="file_id" isRequired={true} render={fileUploadRender} editorOptions={{ placeholder: "Нэр" }} >
            <Label text="Зураг сонгох"/>
          </SimpleItem>
          </FormItem>
         <ButtonItem text="Хадгалах"/>
         </Form>
         </form>
        <div style={{padding: "1rem"}}>
         <HtmlEditor
                height="400px"
                onValueChanged={onHtmlEditorChange}
                value={text}
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
          </ScrollView>
          </Popup>


      <div className="news-data-grid-container">
        <h1 className="html-editor-title">Мэдээ, мэдээлэл засах</h1>
  
        <LoadPanel
        position={{ of: "#dataGrid" }}
        visible={isLoading}
        shading={true}
        showPane={false}
        showIndicator={true}
        message=""
        shadingColor="rgba(255,255,255, 0.8)"
      />  <div style={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
            <DevExtremeButton style={{ marginBottom: 10 }} text="Мэдээ мэдээлэл нэмэх"  type="default" onClick={() => setAddNewsFormToggler(true)}/>
</div>
         <DataGrid 
        id="dataGrid"
        dataSource={allNews}
        keyExpr="id"
        focusedRowEnabled={true}
        wordWrapEnabled={true}
        noDataText="Мэдээлэл байхгүй"
        onSaved={onSavingEvent}
        onRowRemoved ={onRemovingEvent}
        showBorders={true}
        style={{flexWrap: "wrap"}}
        showRowLines={true}
        hoverStateEnabled={true}
        allowColumnResizing={true}
        
        >       
        <h1 className="html-editor-title">Мэдээ, мэдээлэл засах</h1>
        <Editing
          allowUpdating={true}
          allowDeleting={true}
          mode="form"
          height= "20rem"
        >      
          <Button name="save" text="Хадгалах"/>
          <Button name="cancel" text="Цуцлах"/>
          <Button/>
          
          </Editing>

        <Pager
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
          visible="true"
        />
         <Paging defaultPageSize={10} />

        <Column dataField="createdAt" dataType="date" colCount={1} colSpan={2} width="5.5rem" caption="Нийтлэсэн"  allowEditing={false}/>
        <Column dataField="news_title" width="10rem" colCount={1} colSpan={2} caption="Нийтлэлийн гарчиг" />
        <Column dataField="news_text" caption="Нийтлэлийн тайлбар" />
        <Column visible={false} dataField="markup" colCount={1} dataType="string"  editorOptions={{height: "10rem",flex: "1", width: "17.5rem"}} editorType="dxTextArea" caption="Нийтлэл"/>
        <Column type="buttons">
          <Button name="edit" onClick={onClickEdit} text="Өөрчлөх" />
          <Button name="delete" text="Устгах"/>
          <Button name="save" text="Хадгалах"/>
          <Button name="cancel" text="Цуцлах"/>
          <Button/>
        </Column>


        </DataGrid>
         </div>
    </React.Fragment>
  );
};

export default AddNews;
