var pay_level
var reference_year
var yearly_inflation = {2017: 100, 2018: 101.93, 2019: 103.56, 2020: 104.46, 2021: 107.44, 2022: 114.5, 2023: 121.09, 2024: 125.2, 2025: 128.96, 2026: 132.7}
var real_wages
var nominal_wages

function trigger_update(){
var ref_year = $("#year_select").val()
var level = $("#level_select").val()
var verify_input = true
var incr_val
var constr_selector
for (let i = 0; i<4; i++){
    constr_selector = `#inf_input_${i}`
    incr_val = $(constr_selector).val()
    if (isNumeric(incr_val) == false){
verify_input = false
    }
}
if (verify_input == true){
    recalculate_nominal_wages(level)
    calculate_real_wages(ref_year,level)
    var pay_diff = calculate_pay_diff()
    var perc_diff = calculate_perc_diff(pay_diff)
    write_update(ref_year,level,pay_diff,perc_diff)
    write_table()
}
}

function trigger_preset(){
    var preset = $("#select_preset").val()
    for (let i = 0; i<4; i++){
    
    $(`#inf_input_${i}`).val(wage_presets[preset][i+23])
    }
    trigger_update()
}

function recalculate_nominal_wages(level){
    const is_match = (element) => element == level;
    var level_index = level_list.findIndex(is_match)
    nominal_wages = structuredClone(nominal_wages_data[level_index])
    for (let i = 23; i<27;i++){
nominal_wages[i] = nominal_wages[i-1] * (($(`#inf_input_${i-23}`).val()/100)+1)
        }
}

function calculate_real_wages(ref_year,level) {
    var multiplier = []
    // const is_match = (element) => element == level;
    // var level_index = level_list.findIndex(is_match)
    // nominal_wages = structuredClone(nominal_wages_data[level_index])
    real_wages = structuredClone(nominal_wages)
    for (let this_year in yearly_inflation) {
        multiplier.push(yearly_inflation[ref_year]/yearly_inflation[this_year])
    }
    for (let i = 17; i < 27; i++) {
real_wages[i] = nominal_wages[i] * multiplier[i-17]
    }
    console.log(real_wages)
    
}
function calculate_pay_diff(){
    var sum_prev_real_wages = 0
    var avg_prev_real_wages = 0
    var sum_pred_real_wages = 0
    var avg_pred_real_wages = 0
    for (let i = 18; i < 22; i++) {
        sum_prev_real_wages += real_wages[i]
    }
    avg_prev_real_wages = sum_prev_real_wages/4
    for (let i = 23; i < 27; i++) {
        sum_pred_real_wages += real_wages[i]
    }
    avg_pred_real_wages = sum_pred_real_wages/4

    return avg_prev_real_wages - avg_pred_real_wages
}

function calculate_perc_diff(paydiff){
    var sum_prev_real_wages = 0
    var avg_prev_real_wages = 0
    for (let i = 18; i < 22; i++) {
        sum_prev_real_wages += real_wages[i]
    }
    avg_prev_real_wages = sum_prev_real_wages/4

    return (paydiff/avg_prev_real_wages)*100
}
function write_update(ref_year,level,pay_diff,perc_diff){
var localeNum
    console.log(pay_diff)
$("#pay_level").text(level);

$("#selected_year").text(ref_year);

localeNum = Math.round(pay_diff).toLocaleString()
$("#pay_diff").text(localeNum);
$("#perc_diff").text((Math.round(perc_diff*100))/100);
}
function draw_table(){
    var table = '<table id="wages_table">'
    var tr
    var is_header = true
    var constr_tr
    //iterate rows
    for (let i = 0; i < 4; i++) {
    //check if header
        if (is_header == true) {
            tr = "<thead>"
        } else {
            tr = "<tr>"
        }
    // build row
        for (let j = 0; j < 11; j++) {
            if (is_header == true) {
                constr_tr = '<th id="'+(((i)*11)+j)+'"></th>'
                tr +=constr_tr
            } else {
                constr_tr = '<td id="' + (((i)*11)+j) + '"></td>'
                tr += constr_tr
            }
            
        }
        if (is_header == true) {
            tr += "</thead>"
                    } else {
                        tr += "</tr>"
                    }
        is_header = false
        table += tr
    }
    table += '</table>'
    $("#wages_table_container").html(table);
    var constr_selector
    for (let l = 1; l < 11; l ++){
        constr_selector = `#${l}`
$(`#${l}`).text(l+2016)
    }
    //write prev wage rises
    for (let m = 12; m < 18; m ++){
        constr_selector = `#${m}`
 
        $(constr_selector).text("2.10%")
    }
//create input boxes
    var constr_input
    for (let k = 18; k < 22; k ++){
        constr_selector = `#${k}`
        constr_input = '<input class="inf_input" id="inf_input_'+(k-18)+'"  pattern="^\d*(\.\d{0,2})?$" maxlength="5" onchange="trigger_update()" value="'+wage_presets[0][k+5]+'"></input>'
        $(constr_selector).html(constr_input)
    }
    $("#0").text("Year")
    $("#11").text("Increase")
    $("#22").text("Nominal Wages")
    $("#33").text("Real Wages")
}
function write_table() {
    //write nominal wages
    for (let i = 23; i<33; i++) {
        $("#"+i).text("$"+(Math.round(nominal_wages[i-6]).toLocaleString()))
    }
    //write real wages
    for (let j = 34; j<44; j++) {
        $(`#${j}`).text("$"+(Math.round(real_wages[j-17]).toLocaleString()))
    }
    // write previous inflation
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }