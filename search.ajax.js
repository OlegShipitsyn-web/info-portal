<script>
            $(document).ready(function () {
                $.ajaxSetup({cache: false, async: false});
                $('#query').keyup(function () {
                    $('#result').html('');
                    $('#state').val('');
                    var searchField = $('#query').val().trim();
                    if (searchField.length > 3) {
                        $.getJSON('/search-suggest/' + searchField, function (data) {
                            if (data.ul.length > 0) {
                                $('#result').append('<div class="search-drop__title">Юридические лица (' + data.ul_total + ')</div>');
                                $.each(data.ul, function (key, value) {
                                    let name = value.name;
                                    if (value.close) {
                                        name = '<span style="text-decoration: line-through;">' + name + '</span>'
                                    }
                                    let seo = '';
                                    if (value.seo_name.length > 0) {
                                        seo = '<div class="company-item-info"> <dl>  <dt>' + value.seo_title + '</dt> <dd>' + value.seo_name + '</dd>  </dl> </div>';
                                    }
                                    $('#result').append('<a href="/account/' + value.ogrn + '" class="search-drop__item" target="_blank"><div class="search-drop__name">' + name + '</div>' + seo + '<div class="company-item-info"> <dl>  <dt>Адрес</dt> <dd>' + value.address + '</dd>  </dl> </div><div class="company-item-info">  <dl> <dt>ИНН</dt> <dd>' + value.inn + '</dd> </dl><dl> <dt>ОГРН</dt> <dd>' + value.ogrn + '</dd></dl></div></a>');
                                    // $('#result').append('<li class="list-group-item link-class"><span class="text-muted">ОГРН '+value.ogrn+'</span> '+value.name+'</li>');
                                });
                            }
                            if (data.ip.length > 0) {
                                $('#result').append('<div class="search-drop__title">Индивидуальные предприниматели (' + data.ip_total + ')</div>');
                                $.each(data.ip, function (key, value) {
                                    let name = 'ИП ' + value.name;
                                    if (value.close) {
                                        name = '<span style="text-decoration: line-through;">' + name + '</span>'
                                    }
                                    $('#result').append('<a href="/entrepreneur/' + value.ogrn + '" class="search-drop__item" target="_blank"><div class="search-drop__name">' + name + '</div><div class="company-item-info">  <dl> <dt>ИНН</dt> <dd>' + value.inn + '</dd> </dl><dl> <dt>ОГРН</dt> <dd>' + value.ogrn + '</dd></dl></div></a>');
                                    // $('#result').append('<li class="list-group-item link-class"><span class="text-muted">ОГРН '+value.ogrn+'</span> '+value.name+'</li>');
                                });
                            }
                        });
                    }
                });

                // $('#result').on('click', 'li', function() {
                //     var click_text = $(this).text().split('|');
                //     $('#search').val($.trim(click_text[0]));
                //     $("#result").html('');
                // });
            });
        </script>
