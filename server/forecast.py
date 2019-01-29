# -*- coding: utf-8 -*-
import sys, json
from statsmodels.tsa.arima_model import ARIMA
import numpy as np 

def read_in():
   	lines = sys.stdin.readlines()
   	return json.loads(lines[0])

def predict(coef, history):
	yhat = 0.0
	for i in range(1, len(coef)+1):
		yhat += coef[i-1] * history[-i]
	return yhat

def main():

	#getting data from server
	lines = read_in()

   	value_dic = lines[0]
	t9Clock = []
	t12Clock = []
	t15Clock = []

	#storing the temprature measurements for three times (9:00, 12:00 and 15:00)
	for k,v in sorted(value_dic.items()):
		y = k.encode('utf-8')
		
		if(y[11:13]=="09"):
			t9Clock.append(v)
		elif (y[11:13]=="12"):
			t12Clock.append(v)
		elif (y[11:13]=="15"):
			t15Clock.append(v)
			

	temp_array=np.array([t9Clock, t12Clock, t15Clock])

	#apply the arima model to get the presdicted values
	i=0
	while(i<len(temp_array)): 
		size = len(temp_array[i])
		train = temp_array[i][0:size]
		history = [x for x in train]
		predictions = list()
		for t in range(5):
			model = ARIMA(history, order=(1,0,0))
			model_fit = model.fit(trend='nc', disp=False)
			ar_coef = model_fit.arparams
			yhat = predict(ar_coef, history)
			predictions.append(yhat)
			obs = yhat
			history.append(obs)
			print('>predicted=%.3f °C' % (yhat))
		i=i+1

# Start process
if __name__ == '__main__':
   main()