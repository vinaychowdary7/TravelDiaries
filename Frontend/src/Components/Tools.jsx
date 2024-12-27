import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'



export const tools ={
    embed:Embed,
    list:{
        class:List,
        inlineToolbar:true
    },
    image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    success: 1,
                    file: { url: reader.result },
                  });
                };
                reader.onerror = () => reject('Failed to upload image');
                reader.readAsDataURL(file);
              });
            },
          },
        },
      },
    header:{
        class:Header,
        config:{
            placeholder:"Type Heading....",
            levels:[2,3],
            defaultLevel:2
        }
    },
    quote:{
        class:Quote,
        inlineToolbar:true
    },
    marker:Marker,
    inlineCode:InlineCode
}
