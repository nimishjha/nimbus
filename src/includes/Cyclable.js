export class Cyclable
{
	constructor(array, currentIndex)
	{
		if(Array.isArray(array))
		{
			this.values = array;
			if(currentIndex)
				this.currentIndex = currentIndex;
			else
				this.currentIndex = 0;
			if(array.length === 0)
				this.currentIndex = -1;
		}
		else
		{
			console.log("ERROR: expected array, got", typeof array);
		}
	}

	getCurrentValue()
	{
		if(this.currentIndex < 0 || this.currentIndex > this.values.length - 1) return null;
		return this.values[this.currentIndex];
	}

	getCurrentIndex(index)
	{
		return this.currentIndex;
	}

	setCurrentIndex(index)
	{
		this.currentIndex = index;
	}

	setValues(array)
	{
		this.values = array;
		this.currentIndex = Math.min(this.currentIndex, this.values.length - 1);
	}

	getValues()
	{
		return this.values;
	}

	add(value)
	{
		this.values.push(value);
	}

	addAndSelect(value)
	{
		this.values.push(value);
		this.currentIndex = this.values.length - 1;
	}

	nextValue()
	{
		this.currentIndex = Math.min(this.currentIndex + 1, this.values.length - 1);
		return this.values[this.currentIndex];
	}

	previousValue()
	{
		this.currentIndex = Math.max(this.currentIndex - 1, 0);
		return this.values[this.currentIndex];
	}

	nextWrappedValue()
	{
		this.currentIndex = (this.currentIndex + 1) % this.values.length;
		return this.values[this.currentIndex];
	}

	previousWrappedValue()
	{
		this.currentIndex--;
		if(this.currentIndex < 0) this.currentIndex = this.values.length - 1;
		return this.values[this.currentIndex]
	}

	getLength()
	{
		return this.values.length;
	}
}
