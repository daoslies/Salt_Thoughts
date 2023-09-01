
import Wire from './Wire';
import EmbeddingRep from './Embedding_Representation'

const Dyanmic_Menu_Elements = () => {

  return (

    <div className="port-div">

        <svg  
            className="svg-container" id="svg-container"
            width="100vw" height = "100vh"> 
        </svg>  {/* Wire & EmbeddingRep live in the svg-container */}

        <Wire />

        <EmbeddingRep />

    </div>

  );
};

export default Dyanmic_Menu_Elements;
