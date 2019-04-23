import * as React from 'react';
import './preview.scss';
// import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const reorder = (list: Iterable<{}> | ArrayLike<{}>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 0,
  margin: `0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 150
});


class Preview extends React.Component {

  public state: any = {
    col_1: [],
    col_2: [],
    lastThumb: "",
    allFiles: [],
    thumbs: [],
    result: {}
  };

  public index:number = 0;

  public list:any[] = [
    {
      id: 'col_1',
      items : []
    },
    {
      id: "col_2",
      items: []
    }
  ];


  constructor(args: any) {
    super(args);
  
  }

  public removeFile(file: any, e: any, isFirst: boolean) {
    e.stopPropagation();

    const index: number = this.state.allFiles.indexOf(file);
    this.state.allFiles.splice(index, 1);
    if (isFirst) {
      this.setState({ lastThumb: "" });
    } else {
      this.state.thumbs.splice(index, 1);
    }
    this.setState({ allFiles: this.state.allFiles, thumbs: this.state.thumbs });

  }

  public removeFirstPreview() {
    this.setState({ lastThumb: "" });
  }

  public setFiles(acceptedFiles: any) {
    this.index++;
    acceptedFiles.map((file: any) => Object.assign(file, { preview: URL.createObjectURL(file), id : this.index }));
  }

  public acceptedFiles(files: any, colId:any) {
   
    this.setFiles(files);

    const list: any = this.getList(colId);

    const allFiles: any = list.concat(files);

    this.setState({ [colId] : allFiles });
  }


  public getList(id: any) { 
    let list:any = this.list.filter((item: any) => item.id === id);
    if (list.length > 0){
      list = list[0];
      return this.state[list.id];
    }else{
      return {id : "", items: []};
    }
  };

  public onDragEnd(result: any) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: any = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      this.setState({ [source.droppableId] : items});

    } else {
      const resu: any = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );


      this.state.result = resu;
      
      this.setState({ [source.droppableId]: resu[source.droppableId], [destination.droppableId]: resu[destination.droppableId] });
    }
  };


  public render() {

    return (

      <DragDropContext onDragEnd={(result: any) => { this.onDragEnd(result)}}>
    
        <div className="row">
          {this.list.map((listItem:any, di)=> {
            return (<div className="col" key={'dropzone-col-' + di}>
     
              <Dropzone accept="image/*" onDrop={(files) => this.acceptedFiles(files, listItem.id)}>
                {({ getRootProps, getInputProps }) => (
                  <section className="uploadSection">
                    <div className="dropzone" {...getRootProps()}>
                      <div className="dropzoneInner">
                        <div className="firstPreview">{this.state.lastThumb}</div>
                        <div className="displayText">
                          <input {...getInputProps()} />
                          <p>Drag & drop some files here, or click to select files</p>
                        </div>
                      </div>
                    </div>
                    <Droppable droppableId={listItem.id}>
                      {(provided: any, snapshot: any) => (
                        <div
                          className="uploadList"
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          
                          {this.state[listItem.id] === undefined ? "" : this.state[listItem.id].map((item: any, index: any) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(prov: any, snap: any) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  style={getItemStyle(
                                    snap.isDragging,
                                    prov.draggableProps.style
                                  )}>

                                  <div className="thumb">
                                    <div className="thumbInner">
                                      {/* <div className="deleteButton"><button onClick={(e) => this.removeFile(item, e, false)}> X </button></div> */}
                                      <img src={item.preview} className="img" />
                                    </div>
                                  </div>

                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>


                  </section>
                )}
              </Dropzone>
            </div>);
          })}


          {/* <aside className="thumbsContainer">
                  {this.state.thumbs}
                </aside> */}

          {/* <div className="col">
            <Dropzone accept="image/*" onDrop={(files) => this.acceptedFiles(files)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div className="dropzone" {...getRootProps()}>
                    <div className="dropzoneInner">
                      <div className="firstPreview">{this.state.lastThumb}</div>
                      <div className="displayText">
                        <input {...getInputProps()} />
                        <p>Drag & drop some files here, or click to select files</p>
                      </div>
                    </div>
                  </div>
                  
                

                  <Droppable droppableId="col_2">
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {this.state.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}>
                            {(prov: any, snap: any) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                style={getItemStyle(
                                  snap.isDragging,
                                  prov.draggableProps.style
                                )}>
                                {item.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>


                </section>
              )}
            </Dropzone>
          </div> */}

        </div>
      </DragDropContext>

    );
  }

}

export default Preview;