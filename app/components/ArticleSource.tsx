import {IoIosBook} from 'react-icons/io';

export default function ArticleSource(props: {
  source: any;
}) {
  return (
    <div className="m-0">
      <p className='flex justify-left items-center gap-2 font-semibold m-0'><IoIosBook/>Periódico</p>
      <p className="m-0"><span className='underline'>{props.source.periodico}</span> {props.source.date} <br/>{
        props.source.details.map((e: any, i: any) => {
          if (i % 2) {
            return <span key={i}>{e}, </span>
          } else {
            return <span key={i} className='text-slate-700'>{e}: </span>
          }
        })
      }</p>
    </div>
  );
}
