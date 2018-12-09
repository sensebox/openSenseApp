#from pandas import Series

from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
from math import sqrt
import numpy as np #delete it when finish the example
import sys #to get argument from js
 
def predict(coef, history):
	yhat = 0.0
	for i in range(1, len(coef)+1):
		yhat += coef[i-1] * history[-i]
	return yhat
 
a = np.array([ 8.98372881, 17.02583333 ,19.56090909 ,23.11769231 ,22.21220339, 19.72644068,
 15.22588235, 15.65634146, 14.39298246, 17.7015,     16.354,      12.27591837,
  8.12644068])

size = len(a)
train = a[0:size]
history = [x for x in train]
predictions = list()
for t in range(2):
	model = ARIMA(history, order=(1,0,0))
	model_fit = model.fit(trend='nc', disp=False)
	ar_coef = model_fit.arparams
	yhat = predict(ar_coef, history)
	predictions.append(yhat)
	obs = yhat
	history.append(obs)
	print('>predicted=%.3f' % (yhat))