const FilterForm = ({newFilter, handleFilterInput}) => {
  return(
    <div>
        filter shown with <input value={newFilter} onChange={handleFilterInput} />
    </div>
  )
}


export default FilterForm