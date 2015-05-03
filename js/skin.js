


var set=['top=left','top=right','bottom=left','bottom=right'];
var col=['#111','#111','#111','#111'];
function init(){
	//cover
	var _=document.cover=document.createElement('div');
	_.className='cover';
	document.body.appendChild(_);
	//settings
	_.settings = {
		interval: 20
	};
	//quads
	_.quad=[];
	for(var i=0; i<set.length; i++){
		var div=_.quad[i]=document.createElement('div');
		div.className='quadrant';
		with(div.style){
			eval(set[i]+'="0px"');
			backgroundColor=col[i];
		}
		/***********************************
		div.onmouseover=function(){this.style.backgroundColor='#555'};
		div.onmouseout=function(){this.style.backgroundColor=''};
		/**/
		_.appendChild(div);
	}
	//center
	_.center=document.createElement('div');
	_.center.className='center';
	_.center._parent=_;
	_.appendChild(_.center);
	//point
	_.center.point=document.createElement('div');
	_.center.point.className='point';
	_.center.point._parent=_.center;
	_.center.point.innerHTML='<div/>';
	_.center.render = function(){
		var _frame = {quad:[{},{},{},{}]},
			percentx,
			percenty;
		if(this._x!=null&&this._y!=null){
			_frame.center = {};
			// limits
			var X = (this._x>0)?(this._x<this.defs._w)?this._x:this.defs._w:0,
				Y = (this._y>0)?(this._y<this.defs._h)?this._y:this.defs._h:0,
				W = this.defs._w,
				H = this.defs._h;
			// css proerties
			_frame.center.left = _frame.quad[0].width = _frame.quad[2].width = X;
			_frame.center.top = _frame.quad[0].height = _frame.quad[1].height = Y;
			_frame.quad[1].width = _frame.quad[3].width = (W - X);
			_frame.quad[2].height = _frame.quad[3].height = (H - Y);
			// percent
			/**/
			percentx=this.defs._percentx=Math.round(this._x*50/this.defs._w);
			percenty=this.defs._percenty=Math.round(this._y*50/this.defs._h);
			/**
			percentx=Math.round(FISICS.backEaseInOut(percentx,50,50));
			percenty=Math.round(FISICS.backEaseInOut(percenty,50,50));
			/**/
			percentx=Math.round(FISICS.regularEaseInOut(percentx,50,50));
			percenty=Math.round(FISICS.regularEaseInOut(percenty,50,50));
			/**/
		}else{
			percentx = percenty = 25;
		}
		_frame.quad[0].alpha = percentx+percenty;
		_frame.quad[1].alpha = 50-percentx+percenty;
		_frame.quad[2].alpha = 50+percentx-percenty;
		_frame.quad[3].alpha = 100-percentx-percenty;

		return _frame;
	};
	//center & quad methods
	_.skinner = function(obj, styles){
		for(var s in styles){
			switch(s){
				case 'alpha':
					setOpacity(obj,styles[s]);
					break;
				default:
					obj.style[s] = styles[s] + 'px';
			}
		}
	};
	_.center.draw=function(_frame){
		for(var i in _frame){
			if(_frame[i] instanceof Array){
				for(var ii=0; ii<_frame[i].length; ii++){
					_.skinner(_[i][ii], _frame[i][ii]);
				}
			}else{
				_.skinner(_[i], _frame[i]);
			}	
		}
	};
	_.center.drag=function(e){
		if(!e){e=event}
		var trg=document.cover.center;
		trg._x=trg.defs._x+e.clientX-trg.defs._mousex;
		trg._y=trg.defs._y+e.clientY-trg.defs._mousey;
		/*****percent*

		/**/
		trg.draw(trg.render());
	};
	_.center.release=function(){
		if(_ie){stopEvent(document,"selectstart");stopEvent(document,"dragstart")}else{stopEvent(document,"mousedown")}
		stopEvent(document,"touchstart");
		deleteListener("mousemove",_.center.drag,document);
		deleteListener("touchmove",_.center.drag,document);
		_.center.point.onmouseover=_.center.point.onmouseout=function(){null};
		_.center.bounce(true);
	};
	_.center.clear=function(){
		if(this._timeout){
			clearTimeout(this._timeout);
			this._timeout=null;
		}
	};
	_.center.bounce=function(init){
		if(init){
			_.center.clear();
			if(this._interval){clearInterval(this._interval)}
			this._count=0;
			this._end=29;
			//this._rand=[this._end*.45,this._end*.35];
			this._rand=[12,10];
			this._xx=this._x;
			this._yy=this._y;

			//render all frames in advance
			this._frames = [];
			for(var i=0; i<this._end; i++){
				this._x = this._xx + Math.round(FISICS.elasticEaseOut(i,(this.defs._x-this._xx),this._end,0,0,this._rand[0]));
				this._y = this._yy + Math.round(FISICS.elasticEaseOut(i,(this.defs._y-this._yy),this._end,0,0,this._rand[1]));					
				this._frames[i] = _.center.render();
			}

			this._interval = setInterval(function(){document.cover.center.bounce()},_.settings.interval);
		}
		// animation
		if(this._count<=this._end){
			this.draw(this._frames[this._count]);
			this._count++;
		}else{
			clearInterval(this._interval);
			for(var i=0; i<this._parent.quad.length; i++){
				this._parent.quad[i].style.width=this._parent.quad[i].style.height='50%';
			}
			this.style.top=this.style.left='50%';
		}
	};
	_.center.corner=function(init){
		
	};
	_.center.point.onmousedown=function(e){
		if(!e){e=event}
		var win=getWindowSize();
		this._parent.defs={
			_x:this._parent.offsetLeft,
			_y:this._parent.offsetTop,
			_mousex:e.clientX,
			_mousey:e.clientY,
			_w:win._w,
			_h:win._h
		};
		if(_ie){startEvent(document,"selectstart");startEvent(document,"dragstart")}else{startEvent(document,"mousedown")}
		startEvent(document,"touchstart");
		createListener("mousemove",_.center.drag,document);
		createListener("touchmove",_.center.drag,document);
		this.onmouseover=_.center.clear;
		this.onmouseout=function(){
			this._timeout=setTimeout(function(){_.center.release()},100);
		};
	}
	_.center.point.onmouseup=_.center.release;
	_.center.appendChild(_.center.point);
	_.center.draw(_.center.render());
}
window.onload=init;
if(typeof window.orientation!=='undefined'){alert('IS MOBILE DEVICE!')}