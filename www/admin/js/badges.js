var AttendedCount = 5;
var InProgressCount = 5;
var UnattendedCount = 5;
var TotalCount = 5;

function badges(){
    $.ajax({ 
        type: 'GET', 
        url: 'GetCount.php', 
        data: { get_param: '$CrimCnt' }, 
        success: function (data) { 
            var data = data.split(",");
            AttendedCount = parseInt(data[4]);
            InProgressCount = parseInt(data[5]);
            UnattendedCount = parseInt(data[6]);
            TotalCount = parseInt(data[7]);
			});

			complete: console.log(AttendedCount, InProgressCount, UnattendedCount, TotalCount);

        }
    });
};



