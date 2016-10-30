var xenia = xenia || {};
xenia.backgroundColors = [
	    'rgba(255, 99, 132, 0.5)',
	    'rgba(54, 162, 235, 0.5)',
	    'rgba(255, 206, 86, 0.5)',
	    'rgba(75, 192, 192, 0.5)',
	    'rgba(153, 102, 255, 0.5)',
	    'rgba(255, 159, 64, 0.5)'
	];
xenia.borderColors = [
	    'rgba(255,99,132,1)',
	    'rgba(54, 162, 235, 1)',
	    'rgba(255, 206, 86, 1)',
	    'rgba(75, 192, 192, 1)',
	    'rgba(153, 102, 255, 1)',
	    'rgba(255, 159, 64, 1)'
	];
xenia.pie = {
	"render" : function (dom, labels, data) {
		var ctx = document.getElementById(dom);
		var myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: labels,
		        datasets: [{
		            label: '#',
		            backgroundColor: xenia.backgroundColors,
		        	//borderColor: xenia.borderColors,
		            data: data,
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}
}
xenia.bar = {
	"render" : function (dom, labels, data) {
		var ctx = document.getElementById(dom);
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    responsive: true,
    		maintainAspectRatio: false,
		    data: {
		        labels: labels,
		        datasets: [{
		            label: 'distribuzione categorie sociali',
		            backgroundColor: xenia.backgroundColors,
		        	borderColor: xenia.borderColors,
		            data: data,
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}
}




