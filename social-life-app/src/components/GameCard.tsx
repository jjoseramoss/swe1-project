

const GameCard = ({title, description, photo}) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={photo}
          alt="game image"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Who Knows Me? - {title}</h2>
        <p>
          {description}
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
